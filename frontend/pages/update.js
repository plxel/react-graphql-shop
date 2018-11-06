import Link from "next/link";
import UpdateItem from "../components/UpdateItem";

const Update = ({ query }) => <UpdateItem id={query.id} />;

export default Update;
