import { isLoggedIn } from "../../../utils/auth";
import { LoginForm } from "../../LoginForm";
import { PostForm } from "../../PostForm";

export default async function CreatePost() {
  if (!(await isLoggedIn())) return <LoginForm />;
  return <main><h1>Create Post</h1><PostForm /></main>;
}