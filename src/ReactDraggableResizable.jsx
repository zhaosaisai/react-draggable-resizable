import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import cx from 'classnames'
import * as Validator from './validator'
import './style.css'

const noop = () => {}
const async = (func) => setTimeout(func)

export default class ReactDraggableResizable extends React.Component {
    static propTypes = {
        active: PropTypes.bool,
        draggable: PropTypes.bool,
        resizable: PropTypes.bool,
        w: Validator.propIsNumberAndGtSomeValue(0),
        h: Validator.propIsNumberAndGtSomeValue(0),
        minw: Validator.propIsNumberAndGtSomeValue(0),
        minh: Validator.propIsNumberAndGtSomeValue(0),
        x: Validator.propIsNumberAndGtSomeValue(),
        y: Validator.propIsNumberAndGtSomeValue(),
        z: Validator.valueIsStringOrNumberWithDefault(['string', 'number'])('string', 'auto'),
        handles: PropTypes.array,
        axis: Validator.valueMustBeInArray(['x', 'y', 'both']),
        grid: PropTypes.array,
        parent: PropTypes.bool,
        maximize: PropTypes.bool,
        resizing: PropTypes.func,
        activated: PropTypes.func,
        activeUpdated: PropTypes.func,
        deactivated: PropTypes.func,
        resizestop: PropTypes.func,
        dragstop: PropTypes.func,
        dragging: PropTypes.func
    }
    static defaultProps = {
        active: false,
        draggable: true,
        resizable: true,
        w: 200,
        h: 200,
        minw: 50,
        minh: 50,
        x: 0,
        y: 0,
        z: 'auto',
        handles: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
        axis: 'both',
        grid: [1, 1],
        parent: false,
        maximize: false,
        resizing: noop,
        activated: noop,
        activeUpdated: noop,
        deactivated: noop,
        resizestop: noop,
        dragstop: noop,
        dragging: noop
    }
    constructor(props) {
        super(props)
        const {x, y, w, h, z, active} = this.props
        this.state = {
            width: w,
            height: h,
            top: y,
            left: x, 
            zIndex: z,
            resizing: false,
            dragging: false,
            handle: null,
            enabled: active
        }

        this.parentX = this.parentY = 0
        this.parentW = this.parentH = 9999
        this.mouseX = this.mouseY = 0
        this.lastMouseX = this.lastMouseY = 0
        this.mouseOffX = this.mouseOffY = 0
        this.elmX = this.elmY = 0
        this.elmW = this.elmH = 0
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.handleMove.bind(this), true)
        document.addEventListener('mousedown', this.deselect.bind(this), true)
        document.addEventListener('mouseup', this.handleUp.bind(this), true)

        this.elmX = parseInt(this.$el.style.left)
        this.elmY = parseInt(this.$el.style.top)
        this.elmW = this.$el.offsetWidth || this.$el.clientWidth
        this.elmH = this.$el.offsetHeight || this.$el.clientHeight

        this.reviewDimensions()
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps['active'] !== this.props['active']) {
            this.setState({
                active: nextProps['active']
            })
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handleMove.bind(this), true)
        document.removeEventListener('mousedown', this.deselect.bind(this), true)
        document.removeEventListener('mouseup', this.handleUp.bind(this), true)
    }

    elmDown(event) {
        event.stopPropagation()
        const target = event.target || event.srcElement
        if(this.$el.contains(target)) {
            this.reviewDimensions()
            const { activated, activeUpdated, draggable } = this.props
            if(!this.state.enabled) {
                this.setState({
                    enabled: true
                })
                activated()
                activeUpdated(true)
            }
            
            if(draggable) {
                this.setState({
                    dragging: true
                })
            }
        }
    }

    fillParent(event) {
        const { axis, resizing, parent, resizable, maximize } = this.props
        if(!parent || !resizable || !maximize) return

        let done = false

        const animate = () => {
            const { width, height, top, left } = this.state
            if(!done) {
                window.requestAnimationFrame(animate)
            }

            if(axis === 'x') {
                if(width === this.parentW || left === this.parentX) {
                    done = true
                }
            }else if(axis === 'y') {
                if(height === this.parentH || top === this.parentY) {
                    done = true
                }
            }else if(axis === 'both') {
                if(
                    width === this.parentW &&
                    height === this.parentH &&
                    top === this.parentY &&
                    left === this.parentX
                ) {
                    done = true
                }
            }

            if(axis === 'x' || axis === 'both') {
                if(width < this.parentW) {
                    this.elmW++
                    this.setState((prevState) => ({
                        width: prevState.width + 1
                    }))
                }

                if(left > this.parentX) {
                    this.elmX--
                    this.setState((prevState) => ({
                        left: prevState.left - 1
                    }))
                } 
            }

            if(axis === 'y' || axis === 'both') {
                if(height < this.parentH) {
                    this.elmH++
                    this.setState((prevState) => ({
                        height: prevState.height + 1
                    }))
                }
                if(top > this.parentY) {
                    this.elmY--
                    this.setState((prevState) => ({
                        top: prevState.top - 1
                    }))
                }
            }
            resizing(left, top, width, height)
        }
        window.requestAnimationFrame(animate)
    }

    handleDown(handle, event) {
        event.stopPropagation()
        event.preventDefault()
        this.setState({
            handle,
            resizing: true
        })
    }

    handleMove(event) {
        const { resizing, dragging, handle } = this.state
        const { minw, minh, grid, axis, parent } = this.props
        const resizingCallback = this.props.resizing
        const draggingCallback = this.props.dragging

        this.mouseX = event.pageX || event.clientX + document.documentElement.scrollLeft
        this.mouseY = event.pageY || event.clientY + document.documentElement.scrollTop

        let diffX = this.mouseX - this.lastMouseX + this.mouseOffX
        let diffY = this.mouseY - this.lastMouseY + this.mouseOffY

        this.mouseOffX = this.mouseOffY = 0

        this.lastMouseX = this.mouseX
        this.lastMouseY = this.mouseY

        let dX = diffX
        let dY = diffY
        
        if(resizing) {
            if(handle.indexOf('t') > -1) {
                if(this.elmH - dY < minh) {
                    this.mouseOffY = (dY - (diffY = this.elmH - minh))
                }else if(this.elmY + dY < this.parentY) {
                    this.mouseOffY = (dY - (diffY = this.parentY - this.elmY))
                }
                this.elmY += diffY
                this.elmH -= diffY
            }
            if(handle.indexOf('b') > -1) {
                if(this.elmH + dY < minh) {
                    this.mouseOffY = (dY - (diffY = minh - this.elmH))
                }else if(this.elmY + this.elmH + dY > this.parentH) {
                    this.mouseOffY = (dY - (diffY = this.parentH - this.elmY - this.elmH))
                }
                this.elmH += diffY
            }

            if(handle.indexOf('l') > -1) {
                if(this.elmW - dX < minw) {
                    this.mouseOffX = (dX - (diffX = this.elmW - minw))
                }else if(this.elmX + dX < this.parentX) {
                    this.mouseOffX = (dX - (diffX = this.parentX - this.elmX))
                }
                this.elmX += diffX
                this.elmW -= diffX
            }

            if(handle.indexOf('r') > -1) {
                if(this.elmW + dX < minw) {
                    this.mouseOffX = (dX - (diffX = minw - this.elmW))
                }else if(this.elmX + this.elmW + dX > this.parentW) {
                    this.mouseOffX = (dX - (diffX = this.parentW - this.elmW - this.elmX))
                }
                this.elmW += diffX
            }

            this.setState({
                left: (Math.round(this.elmX / grid[0]) * grid[0]),
                top: (Math.round(this.elmY / grid[1]) * grid[1]),
                width: (Math.round(this.elmW / grid[0]) * grid[0]),
                height: (Math.round(this.elmH / grid[1]) * grid[1])
            }, () => {
                const { top, left, width, height } = this.state
                resizingCallback(left, top, width, height)
            })
        }else if(dragging) {
            if(parent) {
                if(this.elmX + dX < this.parentX) {
                    this.mouseOffX = (dX - (diffX = this.parentX - this.elmX))
                }else if(this.elmX + this.elmW + dX > this.parentW) {
                    this.mouseOffX = (dX - (diffX = this.parentW - this.elmX - this.elmW))
                }

                if(this.elmY + dY < this.parentY) {
                    this.mouseOffY = (dY - (diffY = this.parentY - this.elmY))
                }else if(this.elmY + this.elmH +dY > this.parentH) {
                    this.mouseOffY = (dY - (diffY = this.parentH - this.elmH - this.elmY))
                }
            }
            this.elmX += diffX
            this.elmY += diffY

            if(axis === 'x' || axis === 'both') {
                this.setState({
                    left: (Math.round(this.elmX / grid[0]) * grid[0])
                })
            }

            if(axis === 'y' || axis === 'both') {
                this.setState({
                    top: (Math.round(this.elmY / grid[1]) * grid[1])
                })
            }
            async(() => {
                const {left, top} = this.state
                draggingCallback(left, top)
            })
        }
    }

    deselect(event) {
        this.lastMouseX = this.mouseX = event.pageX || event.clientX + document.documentElement.scrollLeft
        this.lastMouseY = this.mouseY = event.pageY || event.clientY + document.documentElement.scrollTop

        const target = event.target || event.srcElement
        const regexp = new RegExp('handle-([trmbl]{2})', '')

        if(!this.$el.contains(target) && !regexp.test(target.className)) {
            const {deactivated, activeUpdated} = this.props
            if(this.state.enabled) {
                this.setState({
                    enabled: false
                })
                deactivated()
                activeUpdated(false)
            }
        }
    }

    handleUp(event) {
        const {width, height, top, left, resizing, dragging} = this.state
        const {resizestop, dragstop} = this.props
        this.setState({
            handle: null
        })
        if(resizing) {
            this.setState({
                resizing: false
            })
            resizestop(left, top, width, height)
        }
        if(dragging) {
            this.setState({
                dragging: false
            })
            dragstop(left, top)
        }
        async(() => {
            this.elmX = left
            this.elmY = top
        })
    }

    reviewDimensions() {
        const { minw, w, minh, h, parent, x, y, resizing} = this.props
        
        if(minw > w) this.setState({ width: minw })
        if(minh > h) this.setState({ height: minh })

        if(parent) {
            const parentW = parseInt(this.$el.parentNode.clientWidth, 10)
            const parentH = parseInt(this.$el.parentNode.clientHeight, 10)

            this.parentW = parentW
            this.parentH = parentH

            if(w > parentW) this.setState({ width: parentW })
            if(h > parentH) this.setState({ height: parentH })

            if(x + w > parentW) this.setState({ width: parentW - x})
            if(y + h > parentH) this.setState({ height: parentH - y })
        }
        async(() => {
            const { width, height, top, left } = this.state
            this.elmW = width
            this.elmH = height
            resizing(left, top, width, height)
        })
    }

    render() {
        const { draggable, resizable, handles, children } = this.props
        const { dragging, resizing, width, height, top, left, zIndex, enabled } = this.state
        return (
            <div
                className={cx('vdr', {
                    draggable,
                    resizable,
                    active: enabled,
                    dragging,
                    resizing
                })}
                style={{
                    width,
                    height,
                    top,
                    left,
                    zIndex
                }}
                onMouseDown={this.elmDown.bind(this)}
                onDoubleClick={this.fillParent.bind(this)}
                ref={(el) => {
                    this.$el = el
                }}
            >
                {
                    resizable && handles.map(handle => (
                        <div
                            className={cx('handle', `handle-${handle}`)}
                            key={handle}
                            style={{display: enabled ? 'block' : 'none'}}
                            onMouseDown={this.handleDown.bind(this, handle)}
                        >

                        </div>
                    ))
                }
                {
                    children
                }
            </div>
        )
    }
}