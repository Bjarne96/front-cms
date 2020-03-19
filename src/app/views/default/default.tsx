import * as React from 'react';
import autobind from "autobind-decorator";
import './default.css';

interface IProps {
}

interface IState {
}

export class Default extends React.Component <IProps, IState>{

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return <div className="defaultClass">Default</div>;
    }

    @autobind
    default() {
            //do something
    }
}
export default Default;