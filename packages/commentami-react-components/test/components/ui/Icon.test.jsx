import React from 'react'
import { shallow } from 'enzyme'
import { Icon } from '../../../src/components/ui/Icon'

describe('Icon', () => {
  test('should render with good defaults', () => {
    const wrapper = shallow(<Icon path="PATH" />)

    expect(
      wrapper.equals(
        <svg version="1.1" viewBox="0 0 24 24" className="nf-commentami-icon" width={24} height={24}>
          <g>
            <path d="PATH" />
          </g>
        </svg>
      )
    ).toBeTruthy()
  })

  test('should use all properties', () => {
    const wrapper = shallow(<Icon path="PATH" viewBox="FOO" width={100} height={200} />)

    expect(
      wrapper.equals(
        <svg version="1.1" viewBox="FOO" className="nf-commentami-icon" width={100} height={200}>
          <g>
            <path d="PATH" />
          </g>
        </svg>
      )
    ).toBeTruthy()
  })

  test('should ignore width and height when class is passed', () => {
    const wrapper = shallow(<Icon path="PATH" viewBox="FOO" className="CLS" />)

    expect(
      wrapper.equals(
        <svg version="1.1" viewBox="FOO" className="CLS" width={null} height={null}>
          <g>
            <path d="PATH" />
          </g>
        </svg>
      )
    ).toBeTruthy()
  })
})
