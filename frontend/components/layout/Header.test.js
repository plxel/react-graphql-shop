import { shallow } from "enzyme";
import wait from "waait";
import Header from './Header';

describe('<Header />', () => {
  it('renders', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.find('Link a').text()).toBe('Sick Fits');
    expect(wrapper.find('Nav')).toHaveLength(1);
    expect(wrapper.find('AutoComplete')).toHaveLength(1);
    expect(wrapper.find('Cart')).toHaveLength(1);
  })
})