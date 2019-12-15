import React, { Component } from 'react';

class ManagerPage extends Component {

  render() {
    return (
      <div id="content"> 
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <h2>These are the current books on the store</h2>
        <table className="table" responsive>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Edition</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col">Buyer</th>
              <th scope="col">Request</th>
              <th scope="col">Purchase</th>
              <th scope="col">Accept Seller</th>
              <th scope="col">Accept Buyer</th>
              <th scope="col"> </th>
            </tr>
          </thead>
          <tbody id="bookList">
            { this.props.books.map((book, key) => {
              return(
              <tr key={key}>
                <th scope="row">{book.id.toString()}</th>
                <td>{book.name}</td>
                <th scope="row">({book.edition.toString()})</th>
                <td>{window.web3.utils.fromWei(book.price.toString(), 'Ether')}</td>
                <td>{book.owner}</td>
                <td>{book.buyer}</td>
                <td>  
                    { !book.hold
                      ? <p>Available</p>
                      : <button 
                        className="requestButton"
                        disabled = {true}
                        name = {book.id}
                        value = {book.price}
                        onClick={(event) => {
                          console.log("already requested!")
                        }}
                        >
                          Requested
                        </button>
                    }
                </td>
                <td>  
                    { !book.purchased
                      ? <p>Available</p>
                      : <button 
                        className="purchaseButton"
                        disabled = {true}
                        name = {book.id}
                        value = {book.price}
                        onClick={(event) => {
                          console.log("already purchased!")
                        }}
                        >
                          Purchased
                        </button>
                    }
                </td>
                <td>  
                    { !book.hold
                      ? null

                      : !book.sellerok
                        ? <p>Seller Standby</p>
                        : <p>Seller Accepted!</p>
                      
                      }
                </td>
                <td>  
                    { !book.hold
                      ? null

                      : !book.buyerok
                        ? <p>Buyer Standby</p>
                        : <p>Buyer Accepted!</p>
                      
                      }
                </td>
                <td>  
                    { !book.hold
                      ? null
                      :
                        !book.sellerok
                        ? null
                        : 
                          !book.buyerok
                            ? null
                            : <button 
                              className="depositButton"
                              name = {book.id}
                              value = {book.price * 2 - book.discount}
                              onClick={(event) => {
                                this.props.deposit(event.target.name, event.target.value)
                              }}
                              >
                                Deposit
                              </button>
                        
                    }
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ManagerPage; 