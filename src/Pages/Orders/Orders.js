import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Contexts/AuthProvider/AuthProvider';
import Orderrow from './Orderrow';

const Orders = () => {

    const { user, logOut } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch(`https://genius-car-server-kappa.vercel.app/orders?email=${user?.email}`, {
            headers: {
                 authorization: `Bearer ${localStorage.getItem('genius-token')}`
              }
        })
            .then(res => {
              if(res.status === 401 || res.status === 403)
              {
                return logOut()
              }
              return res.json();
            })
            .then(data => {
                // console.log('received', data)
                setOrders(data);
            })
    }, [user?.email, logOut])

    const handleDelete = id => {

        const proceed = window.confirm('Are you sure, you want to cancel this order');
        if (proceed) {
            fetch(`https://genius-car-server-kappa.vercel.app/orders/${id}`, {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${localStorage.getItem('genius-token')}`
                 }
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data);
                    if (data.deletedCount > 0) {
                        alert('deleted successfully');
                        const remaining = orders.filter(odr => odr._id !== id);
                        setOrders(remaining);
                    }
                })
        }

    }

    const handleStatusUpdate = id => {

        fetch(`https://genius-car-server-kappa.vercel.app/orders/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('genius-token')}`
            },
            body: JSON.stringify({status: 'Approved'}) 
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.modifiedCount > 0)
            {
              const remaining = orders.filter(odr => odr._id !== id);
              const approving = orders.find(odr => odr._id === id);
              approving.status = 'Approved'

              const newOrders = [approving, ...remaining];
              setOrders(newOrders);
            }
        })
    }

    return (
        <div>
            <h2 className='text-5xl'>You have {orders.length} Orders</h2>

            <div className="overflow-x-auto w-full">
                <table className="table w-full">

                    <thead>
                        <tr>
                            <th>
                            
                            </th>
                            <th>Name</th>
                            <th>Job</th>
                            <th>Favorite Color</th>
                            <th>Message</th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            orders.map(order => <Orderrow
                                key={order._id}
                                order={order}
                                handleDelete={handleDelete}
                                handleStatusUpdate={handleStatusUpdate}
                            ></Orderrow>)
                        }

                    </tbody>


                </table>
            </div>

        </div>
    );
};

export default Orders;