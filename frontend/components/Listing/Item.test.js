import { shallow } from "enzyme";
import Item from "./Item";

const fakeItem = {
  id: "ABC123",
  title: "A cool item",
  price: 5000,
  description: "This item is really cool",
  image: "dog.png",
  largeImage: "largedog.png"
};

describe("<Item />", () => {
  it("renders the image properly", () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    const img = wrapper.find("img");
    expect(img.prop("src")).toBe(fakeItem.image);
    expect(img.prop("alt")).toBe(fakeItem.title);
  });

  it("renders the pricatag and title properly", () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    const PriceTag = wrapper.find("PriceTag");
    expect(PriceTag.children().text()).toBe("$50");
    expect(wrapper.find("Title a").text()).toBe(fakeItem.title);
  });

  it('renders the buttons properly', () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    const buttonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find('Link')).toHaveLength(1);
    expect(buttonList.find('AddToCart')).toHaveLength(1);
    expect(buttonList.find('DeleteItem')).toHaveLength(1);
  })
});
