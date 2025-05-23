import { useParams } from "react-router-dom";

export default function User() {

    const {userID} = useParams();
    console.log(userID);
    return(
        <>
            <h3>Hi, I am user {userID}</h3>
        </>
    )
}