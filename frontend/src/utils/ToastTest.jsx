import React, { useContext } from "react";

import GlobalMethods from "./GlobalMethods";

const ToastTest = () => {
    const { addToast } = useContext(GlobalMethods);

    const handleClick = (_e) => {
        addToast("Some Message");
    };

    return <button onClick={handleClick}>+ Add Toast</button>;
};

export default ToastTest;
