import { useContext } from "react";
import { AuthContext } from "../context/authContext";

function Homepage()
{
    const {user, logout}= useContext(AuthContext)
    return(
        <>
                <h1>This is a homepage</h1>
                {user?
                        <>
                       
                           <h2> {user.email} is logged in</h2>

                        </>
                :
                <>
                
                <p>
                    There is no user data
                </p>
                
                </>
                }
       </>
    )
}

export default Homepage;