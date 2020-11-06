import React from "react";
import Modal from "react-bootstrap/Modal";

import styles from "./uesrfeedback.module.css"

const UserFeedback = () => {
    const [isOpen, setIsOpen] = React.useState(true);
    const [title, setTitle] = React.useState("Loading...")

    const showModal = () => {
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    const modalLoaded = () => {
        setTitle("Not satisfied with the result? Propose some categories that you would like to see in future searches. :)");
    };

    return (
        <>
            <Modal centered className={styles.feedback} show={isOpen} onHide={hideModal} onEntered={modalLoaded}>
                <Modal.Header className={styles.header}>
                    <Modal.Title className={styles.title}>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input className={styles.searchBar} placeholder="Use comma to split each category" type="text" name="fname"/>
                </Modal.Body>
                <Modal.Footer className={styles.footer}>
                    <button className={styles.cancelButton} onClick={hideModal}>算了 :(</button>
                    <button className={styles.saveButton} onClick={hideModal}>好的 :P</button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UserFeedback;