import { shallow } from "enzyme";
import wait from "waait";
import Page from './Page';

describe('<Page />', () => {
  it('renders', () => {
    const wrapper = shallow(<Page>test</Page>);

    expect(wrapper.find('ThemeProvider')).toHaveLength(1);
  })
})