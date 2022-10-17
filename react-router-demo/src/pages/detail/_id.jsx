import {
    useParams,
    useSearchParams,
} from "react-router-dom";


const Detail = () => {
    const { id } = useParams();
    console.log('useParams --> id: ', id)
    const [searchParams] = useSearchParams();
    const paramsName = searchParams.getAll('name');
    console.log('useSearchParams --> name: ', paramsName)

    return (
        <div style={{padding: '10px'}}>
            <p>ID: { id }</p>
            {
                paramsName.length > 0 && (
                    <p>Name: { searchParams.getAll('name') }</p>
                )
            }
        </div>
    )
}
export default Detail;
