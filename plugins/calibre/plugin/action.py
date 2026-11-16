"""Toolbar button and menu: add or remove reading emphasis on the selected books.

Books are copied out of the library in the GUI thread, converted in a calibre
background job (one chapter in memory at a time, cancellable from the Jobs list)
and written back in the GUI thread. The first conversion keeps the untouched
book as ORIGINAL_EPUB, the same convention as calibre's own Polish books tool.
"""

import os
import shutil
import tempfile
from functools import partial

from calibre.gui2 import Dispatcher, error_dialog
from calibre.gui2.actions import InterfaceAction
from calibre.gui2.threaded_jobs import ThreadedJob
from qt.core import QMenu

from calibre_plugins.fita.config import current_options
from calibre_plugins.fita.engine.brand import NAME
from calibre_plugins.fita.engine.epub import ConvertError, convert_epub, remove_emphasis

load_translations()  # noqa: F821 (calibre builtin)

FORMAT = "EPUB"
ORIGINAL = "ORIGINAL_EPUB"


def _work(books, mode, options, style, abort=None, log=None, notifications=None):
    """Runs in the job thread: converts temporary copies, never touches the library."""
    done, failed = [], []
    for index, (book_id, title, path) in enumerate(books):
        if abort is not None and abort.is_set():
            break
        out = f"{path}.out.epub"

        def progress(fraction, index=index, title=title):
            if notifications is not None:
                notifications.put(((index + fraction) / len(books), title))

        try:
            if mode == "add":
                convert_epub(path, out, options, style, progress, abort.is_set if abort else None)
            else:
                remove_emphasis(path, out, progress, abort.is_set if abort else None)
        except ConvertError as e:
            failed.append((title, e.code))
        except InterruptedError:
            break
        except Exception:
            if log is not None:
                log.exception(f"{title}: conversion failed")
            failed.append((title, "error"))
        else:
            done.append((book_id, out))
    return done, failed


class FitaAction(InterfaceAction):
    name = NAME
    action_spec = (
        _("Reading emphasis"),  # noqa: F821
        None,
        _("Emphasize the start of each word in the selected EPUB books"),  # noqa: F821
        None,
    )
    action_type = "current"
    dont_add_to = frozenset(["context-menu-device"])

    def genesis(self):
        self.qaction.setIcon(get_icons("images/icon.png", NAME))  # noqa: F821
        self.menu = QMenu(self.gui)
        self.qaction.setMenu(self.menu)
        self.qaction.triggered.connect(self.add_emphasis)
        self.create_menu_action(
            self.menu,
            "fita-add",
            _("Add reading emphasis"),  # noqa: F821
            triggered=self.add_emphasis,
        )
        self.create_menu_action(
            self.menu,
            "fita-remove",
            _("Remove reading emphasis"),  # noqa: F821
            triggered=self.remove_emphasis,
        )
        self.menu.addSeparator()
        self.create_menu_action(
            self.menu,
            "fita-configure",
            _("Settings…"),  # noqa: F821
            triggered=self.configure,
        )

    def configure(self):
        self.interface_action_base_plugin.do_user_config(self.gui)

    def add_emphasis(self):
        self.start("add")

    def remove_emphasis(self):
        self.start("remove")

    def start(self, mode):
        ids = list(self.gui.library_view.get_selected_ids())
        if not ids:
            return error_dialog(
                self.gui, NAME, _("Select one or more books first."), show=True  # noqa: F821
            )
        db = self.gui.current_db.new_api
        ids = [i for i in ids if db.has_format(i, FORMAT)]
        if not ids:
            return error_dialog(
                self.gui,
                NAME,
                _(  # noqa: F821
                    "None of the selected books has an EPUB format. "
                    "Convert them to EPUB with calibre first."
                ),
                show=True,
            )
        folder = tempfile.mkdtemp(prefix=f"{NAME}-")
        books = []
        for book_id in ids:
            path = os.path.join(folder, f"{book_id}.epub")
            db.copy_format_to(book_id, FORMAT, path)
            books.append((book_id, db.field_for("title", book_id), path))
        options, style = current_options()
        if mode == "add":
            description = _("Adding reading emphasis (%d)") % len(books)  # noqa: F821
        else:
            description = _("Removing reading emphasis (%d)") % len(books)  # noqa: F821
        job = ThreadedJob(
            NAME,
            description,
            _work,
            (books, mode, options, style),
            {},
            # ThreadedJob calls back from its worker thread: hop to the GUI thread.
            Dispatcher(partial(self.finished, mode=mode, folder=folder)),
        )
        self.gui.job_manager.run_threaded_job(job)
        self.gui.status_bar.show_message(description, 3000)

    def finished(self, job, mode="add", folder=""):
        try:
            if job.failed:
                return self.gui.job_exception(job, dialog_title=NAME)
            done, failed = job.result
            db = self.gui.current_db.new_api
            for book_id, path in done:
                if mode == "add" and not db.has_format(book_id, ORIGINAL):
                    db.save_original_format(book_id, FORMAT)
                db.add_format(book_id, FORMAT, path, replace=True, run_hooks=False)
            if done:
                view = self.gui.library_view
                view.model().refresh_ids([book_id for book_id, _path in done], current_row=view.currentIndex().row())
            reasons = {
                "drm": _("protected with DRM; it cannot be converted"),  # noqa: F821
                "invalid": _("not a valid EPUB file"),  # noqa: F821
                "error": _("unexpected error, see the job details"),  # noqa: F821
            }
            if failed:
                details = "\n".join(f"{title}: {reasons[code]}" for title, code in failed)
                error_dialog(
                    self.gui,
                    NAME,
                    _("Books updated: %d. Some books could not be converted.")  # noqa: F821
                    % len(done),
                    det_msg=details,
                    show=True,
                )
            else:
                self.gui.status_bar.show_message(
                    _("Books updated: %d") % len(done), 5000  # noqa: F821
                )
        finally:
            shutil.rmtree(folder, ignore_errors=True)

