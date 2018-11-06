import { shallow, mount } from "enzyme";
import wait from "waait";
import CartCount from './CartCount';

describe('<CartCount />', () => {
  it('renders null for 0 items', () => {
    const wrapper = shallow(<CartCount count={0} />);
    expect(wrapper.get(0)).toBe(null);
  })

  it('renders count', () => {
    const wrapper = mount(<CartCount count={3} />);
    expect(wrapper.text()).toBe('3');
  })
})