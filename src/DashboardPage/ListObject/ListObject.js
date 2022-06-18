import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

const ListObject = (props) => {
    return (
        <Link to={'/list/' + props.id}>
            <div className='ListObject'>
                <span className='ListName label label-primary'>{props.name}</span>
            </div>
        </Link>
    )

}

export default ListObject