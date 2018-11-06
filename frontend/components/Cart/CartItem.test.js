import { shallow } from "enzyme";
import wait from "waait";
import { fakeCartItem } from "../../lib/testUtils";
import CartItem from "./CartItem";

const cartItem = fakeCartItem();

describe("<CartItem />", () => {
  it("renders", () => {
    const wrapper = shallow(<CartItem cartItem={cartItem} />);
    expect(wrapper.find("h3").text()).toBe(cartItem.item.title);
  });

  it("renders label that item was deleted, if cartItem.item === null", () => {
    const wrapper = shallow(
      <CartItem cartItem={{ ...cartItem, item: null }} />
    );
    expect(wrapper.find("span").text()).toContain("This Item has been removed");
  });

  it("renders price and quantity correctly", () => {
    const item = {...cartItem, item: {...cartItem.item }};
    item.quantity = 10;
    item.item.price = 1000;
    const wrapper = shallow(<CartItem cartItem={item} />);
    expect(wrapper.find("p").text()).toBe("$100 - 10 × $10 each");
  });
});
