// ================================================================================
// Constructor
// ================================================================================
class Slider extends React.Component {
  static get defaultProps() {
    return {
      controlled: false,
      readOnly: false,
      hideCursor: true,
      direction: 'horizontal',
    }
  }

  constructor(props) {
    super(props)
// ================================================================================
// Initial State
// ================================================================================
  this.state = {
    value: 0,
  }

// ================================================================================
// Bound Methods
// ================================================================================
  this.onMouseDown = this.onMouseDown.bind(this)
  this.onMouseMove = this.onMouseMove.bind(this)
  this.onMouseUp = this.onMouseUp.bind(this)

// ================================================================================
// Styles
// ================================================================================
    this.css = () => `
      .hem-slider {
        position: relative;
        width: 200px;
        height: 20px;
        border: 1px solid black;
        box-sizing: border-box;
        user-select: none;
      }

      .hem-slider * {
        user-select: none;
      }

      .hem-slider__progress {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: black;
      }
    `
// ================================================================================
// Class Properties
// ================================================================================#
    this.el = null
  }

// ================================================================================
// Lifecycle
// ================================================================================#
  componentDidMount() {
    appendStyle(this.css())

    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
  }

// ================================================================================
// Handlers
// ================================================================================
  onMouseDown(evt) {
    const { id, hideCursor, onDragStart, onMouseDown, onChange, readOnly } = this.props
    if (readOnly) return
    evt.stopPropagation()
    window.dragging = id
    if (hideCursor) {
      document.body.style.cursor = 'none'
    }
    const value = coords(evt, this.el).x
    this.setState({value}, () => {
      if (onChange) {
        onChange(this.state.value)
      }
    })
    if (onDragStart) {
      onDragStart()
    }
    if (onMouseDown) {
      onMouseDown()
    }
  }

  onMouseMove(evt) {
    const { onChange, readOnly } = this.props
    if (readOnly) return
    evt.stopPropagation()
    if (window.dragging !== this.props.id) return
    const value = coords(evt, this.el).x
    this.setState({value}, () => {
      if (onChange) {
        onChange(this.state.value)
      }
    })
  }

  onMouseUp(evt) {
    evt.stopPropagation()
    const { hideCursor, onDragEnd } = this.props
    window.dragging = undefined
    if (hideCursor) {
      document.body.style.cursor = 'auto'
    }
    if (onDragEnd) {
      onDragEnd()
    }
  }

// ================================================================================
// Other Methods
// ================================================================================
// N/A

// ================================================================================
// Render
// ================================================================================
  render() {
    const { direction, value: propsValue, controlled } = this.props
    const { value: stateValue } = this.state
    const value = controlled ? propsValue : stateValue

    // console.log(propsValue)

    return (
      e('div', {
        className: 'hem-slider',
        onMouseDown: this.onMouseDown,
        onMouseUp: this.onMouseUp,
        ref: el => this.el = el
      },
        e('div', {
          className: 'hem-slider__progress',
          style: {
            [direction === 'vertical' ? 'height' : 'width']: `${value * 100}%`,
          },
        })
      )
    )
  }
}

window.Slider = Slider