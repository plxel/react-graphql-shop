import Link from "next/link";
import Items from "../components/Listing/Items";

const Home = props => <Items page={parseInt(props.query.page, 10) || 1} />;

export default Home;
