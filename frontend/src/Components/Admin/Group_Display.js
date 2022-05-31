import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Group_Display.css'
import {Button} from 'react-bootstrap';

export default function Group_Display(){

    const [groupList, setGroups] = useState([]);

    
    useEffect(() => {
        const getGroupList = async() => {
            try {
                const res = await axios.get('http://localhost:5000/group/getdata/assigned')
                setGroups(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        getGroupList()
    },[]);

    return(
        <div>
            <div className='groupTable'>
            <div className="container ">
                
                <table className="table ">
                    <thead>
                        <tr  key={"1"}>
                            <th> Group ID</th>
                            <th> Student ID </th>
                            <th> Panel Status </th>

                            <div className="col-lg-9 mt-2 mb-2">
                            </div>
                        </tr>
                    </thead>

                    <tbody>
                    {
                        groupList.map((groups, id) => (
                            <tr key={id}>
                                <td>{groups.group_id}</td>
                                <td>{groups.user_id}</td>
                                <td>{groups.pannel_status}</td>

                                <td>
                                    <Link to={`/viewGroup/${groups._id}`}><Button className='btn1'>View Details</Button></Link>
                                </td>
                            
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    );
}