<p align="center">
	<img src="https://github.com/2json/react-draggable-resizable/blob/master/assets/logo.png" />
</p>

# react-draggable-resizable

[![Build Status](https://travis-ci.org/2json/react-draggable-resizable.svg?branch=master)](https://travis-ci.org/2json/react-draggable-resizable)

> React Component for draggable and resizable component

### 安装

使用`npm`

```bash
npm install https://github.com/2json/react-draggable-resizable.git --save
```

使用`yarn`

```bash
yarn add https://github.com/2json/react-draggable-resizable.git
```

### 基本使用

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import ReactDraggableResizable from 'ReactDraggableResizable'

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
```

[更多例子](https://github.com/2json/react-draggable-resizable/tree/master/examples)



### Props

##### active

- Type: `Boolean`
- Required: `false`
- Default: `false`

用于控制组件的状态

```jsx
<ReactDraggableResizable active={true}></ReactDraggableResizable>
```

##### draggable

- Type: `Boolean`
- Required: `false`
- Default: `true`

控制组件是否能够拖动

```jsx
<ReactDraggableResizable draggable={false}></ReactDraggableResizable>
```

##### resizable

- Type: `Boolean`
- Required: `false`
- Default: `true`

控制组件是否能够缩放

##### w

- Type: `Number`
- Required: `false`
- Default: `200`

拖动元素的初始化宽度

```jsx
<ReactDraggableResizable w={200}></ReactDraggableResizable>
```

##### h

- Type: `Number`
- Required: `false`
- Default: `200`

拖动元素的初始化高度

```jsx
<ReactDraggableResizable h={200}></ReactDraggableResizable>
```

##### minw

- Type: `Number`
- Required: `false`
- Default: `50`

拖动元素的最小宽度

```jsx
<ReactDraggableResizable minw={50}></ReactDraggableResizable>
```

##### minh

- Type: `Number`
- Required: `false`
- Default: `50`

拖动元素的最小高度

```jsx
<ReactDraggableResizable minh={50}></ReactDraggableResizable>
```

##### x

- Type: `Number`
- Required: `false`
- Default: `0`

拖动元素初始left值

```jsx
<ReactDraggableResizable x={50}></ReactDraggableResizable>
```

##### y

- Type: `Number`
- Required: `false`
- Default: `0`

拖动元素初始top值

```jsx
<ReactDraggableResizable y={50}></ReactDraggableResizable>
```

##### z

- Type: `String | Number`
- Required: `false`
- Default: `auto`

拖动元素的zIndex值

```jsx
<ReactDraggableResizable z={50}></ReactDraggableResizable>
```

##### handles

- Type: `Array`
- Required: `false`
- Default: `['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']`

控制元素可以拖动的方向

- `tl` - 左上角
- `tm` - 上边的中部
- `tr` - 右上角
- `mr` - 右边的中部
- `br` - 右下角
- `bm` - 下边的中部
- `bl` - 左下角
- `ml` - 左边的中部

```jsx
<ReactDraggableResizable handles={['tm', 'tr', 'tl']}></ReactDraggableResizable>
```

##### axis

- Type: `String`
- Required: `false`
- Default: `both`

控制拖动元素的拖动的方向

```jsx
<ReactDraggableResizable axis='x'></ReactDraggableResizable>
```

##### grid

- Type: `Array`
- Required: `false`
- Default: `[1,1]`

控制拖动元素在x和y轴的每次移动的距离

```jsx
<ReactDraggableResizable grid={[10, 5]}></ReactDraggableResizable>
```

##### parent

- Type: `Boolean`
- Required: `false`
- Default: `false`

控制拖动元素是否只能在父节点中移动和缩放

```jsx
<ReactDraggableResizable parent={true}></ReactDraggableResizable>
```

##### maximize

- Type: `Boolean`
- Required: `false`
- Default: `false`

设置为true，则双击拖动元素，充满父元素

```jsx
<ReactDraggableResizable maximize={true}></ReactDraggableResizable>
```

##### activated

- Type: `Function`
- Required: `false`
- Parameters: `无`

当拖动元素被点击的时候调用

```jsx
<ReactDraggableResizable
	activated={() => {console.log('Element Clicked!!!')}}  
>

</ReactDraggableResizable>
```

##### deactivated

- Type: `Function`
- Required: `false`
- Parameters: `无`

点击拖动元素之外的区域，拖动元素失去焦点的时候调用

```jsx
<ReactDraggableResizable
	deactivated={() => {console.log('deactivated')}}  
>

</ReactDraggableResizable>
```

##### resizing

- Type: `Function`
- Required: `false`
- Parameters: 
  - `left` 拖动元素的left值
  - `top` 拖动元素的top值
  - `width` 拖动元素的宽度
  - `height` 拖动元素的高度

当拖动元素被缩放的时候被调用

```jsx
<ReactDraggableResizable
	resizestop={(left, top, width, height) => {console.log(`left: ${left}, top: ${top}, width: ${width}, height: ${height}`)}}>

</ReactDraggableResizable>
```

##### resizestop

- Type: `Function`
- Required: `false`
- Parameters: 
  - `left` 拖动元素的left值
  - `top` 拖动元素的top值
  - `width` 拖动元素的宽度
  - `height` 拖动元素的高度

当拖动元素缩放停止的时候被调用

```jsx
<ReactDraggableResizable
	resizestop={(left, top, width, height) => {console.log(`left: ${left}, top: ${top}, width: ${width}, height: ${height}`)}}>

</ReactDraggableResizable>
```

##### dragging

- Type: `Function`
- Required: `false`
- Parameters: 
  - `left` 拖动元素的left值
  - `top` 拖动元素的top值

当拖动元素被拖动的时候调用

```jsx
<ReactDraggableResizable dragging={(left, top) => {console.log(`left: ${left}, top: ${top}`)}}>

</ReactDraggableResizable>
```

##### dragstop

- Type: `Function`
- Required: `false`
- Parameters: 
  - `left` 拖动元素的left值
  - `top` 拖动元素的top值

当拖动元素拖动停止的时候调用

```jsx
<ReactDraggableResizable dragstop={(left, top) => {console.log(`left: ${left}, top: ${top}`)}}>

</ReactDraggableResizable>
```



