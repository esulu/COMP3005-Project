import React, { Fragment, useState } from 'react';

type EditProps = {
    row: Author
}

type Author = {
    author_id: string,
    name: string
}

export const Edit = ({ row }: EditProps) => {

    const [authorName, setAuthorName] = useState(row.name);

    // Edit author name function
    const updateAuthorName = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            const body = { authorName };
            const response = await fetch(`https://localhost:5000/edit/${row.author_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            // TODO: remove this
            console.log(response);

            // refreshes (maybe doesn't work)
            // window.location = '/';
            window.location.replace("/");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Fragment>
            <button
                type="button"
                className="btn btn-default"
                data-toggle="modal"
                data-target={`#id${row.author_id}`}>
                Edit
            </button>

            <div
                id={`id${row.author_id}`}
                className="modal fade"
                role="dialog"
                onClick={() => setAuthorName(row.name)}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Row</h4>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                onClick={() => setAuthorName(row.name)}
                            >&times;</button>
                        </div>

                        <div className="modal-body">
                            <input
                                type="text"
                                className="form-control"
                                value={authorName}
                                onChange={e => setAuthorName(e.target.value)}
                            />
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-default"
                                data-dismiss="modal"
                                onClick={e => updateAuthorName(e)}>
                                Edit
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-dismiss="modal"
                                onClick={() => setAuthorName(row.name)}>
                                Close
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    );
}