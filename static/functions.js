/*
    FILE:           functions.js
    PROJECT:        posts_proj
    PROGRAMMER:     Quade Nielsen
    LAST EDIT:      April 7, 2023
    DESCRIPTION:    This file contains common JS functions for the posts_proj web application.
*/

/*
    NAME:           handleAlerts

    DESCRIPTION:    Injects html into an alertBox object, displaying an alert on the page.

    PARAMETERS:     type:   the type of alert
                    msg:    the message to be displayed in the alert

    RETURNS:        none
*/
const handleAlerts = (type, msg) => {
    alertBox.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${msg}
        </div>
    `
}