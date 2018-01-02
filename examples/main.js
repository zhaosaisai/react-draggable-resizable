import React from 'react'
import ReactDOM from 'react-dom'
import ReactDraggableResizable from '../src'
import './common.css'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            width: 0,
            height: 0,
            left: 0,
            right: 0
        }
    }

    onDrag(left, top) {
        this.setState({
            left,
            top
        })
    }

    onResize(left, top, width, height) {
        this.setState({
            left, 
            top,
            width,
            height
        })
    }

    render() {
        const { left, top, width, height } = this.state
        return (
            <ReactDraggableResizable
                w={200}
                h={200}
                dragging={this.onDrag.bind(this)}
                resizing={this.onResize.bind(this)}
            >
                <div>
                    <div>left: {left}</div>
                    <div>top: {top}</div>
                    <div>width: {width}</div>
                    <div>height: {height}</div>
                </div>
            </ReactDraggableResizable>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))