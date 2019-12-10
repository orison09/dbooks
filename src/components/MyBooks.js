import React, { Component } from 'react';

class MyBooks extends Component {

  render() {
    return (
      <div id="content"> 
      	<p>&nbsp;</p>
        <p>&nbsp;</p>

        <h2>My Books</h2>
        <h2>These are your books on sale</h2>
        <table className="table" responsive>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Edition</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
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
              (this.props.thisaccount != book.owner)
              ? null
              : <tr key={key}>
                <th scope="row">{book.id.toString()}</th>
                <td>{book.name}</td>
                <th scope="row">{book.edition.toString()}</th>
                <td>{window.web3.utils.fromWei(book.price.toString(), 'Ether')}</td>
                <td>{book.owner}</td>
                <td>  
                    { !book.hold
                      ? <button 
                        className="requestButton"
                        name = {book.id}
                        value = {book.price}
                        onClick={(event) => {
                          this.props.requestBook(event.target.name, event.target.value)
                        }}
                        >
                          Request
                        </button>
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
                      ? <button 
                        className="purchaseButton"
                        name = {book.id}
                        value = {book.price}
                        onClick={(event) => {
                          this.props.purchaseBook(event.target.name, event.target.value)
                        }}
                        >
                          Purchase
                        </button>
                      : <button 
                        className="purchaseButton"
                        disabled = {true}
                        name = {book.id}
                        value = {book.price}
                        onClick={(event) => {
                          console.log("already purchased!")
                        }}
                        >
                          Purchasing
                        </button>
                    }
                </td>
                <td>  
                    { !book.hold
                      ? null

                      : !book.sellerok
                        ? <button 
                          className="acceptButton"
                          name = {book.id}
                          value = {book.price}
                          onClick={(event) => {
                            //this.props.accept(event.target.name, event.target.value)
                            this.props.accept(event.target.name)
                          }}
                        >
                            Accept
                          </button>
                        : <button 
                          className="acceptButton"
                          name = {book.id}
                          value = {book.price}
                          disabled = {true}
                          onClick={(event) => {
                            console.log("seller already Accepted!")
                          }}
                          >
                            Seller Accepted
                          </button>
                      
                      }
                </td>
                <td>  
                    { !book.hold
                      ? null

                      : !book.buyerok
                        ? <button 
                          className="acceptButton"
                          name = {book.id}
                          value = {book.price}
                          
                          onClick={(event) => {
                            this.props.accept(event.target.name)
                          }}
                        >
                            Accept
                          </button>
                        : <button 
                          className="acceptButton"
                          name = {book.id}
                          value = {book.price}
                          disabled = {true}
                          onClick={(event) => {
                            console.log("buyer already Accepted!")
                          }}
                          >
                            Buyer Accepted
                          </button>
                      
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


        <h2>These are your requested Books</h2>
        <table className="table" responsive>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Edition</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
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
              (this.props.thisaccount != book.buyer)
              ? null
              : <tr key={key}>
                <th scope="row">{book.id.toString()}</th>
                <td>{book.name}</td>
                <th scope="row">{book.edition.toString()}</th>
                <td>{window.web3.utils.fromWei(book.price.toString(), 'Ether')}</td>
                <td>{book.owner}</td>
                <td>  
                    { !book.hold
                      ? <button 
                        className="requestButton"
                        name = {book.id}
                        value = {book.price}
                        onClick={(event) => {
                          this.props.requestBook(event.target.name, event.target.value)
                        }}
                        >
                          Request
                        </button>
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
                      ? <button 
                        className="purchaseButton"
                        name = {book.id}
                        value = {book.price}
                        onClick={(event) => {
                          this.props.purchaseBook(event.target.name, event.target.value)
                        }}
                        >
                          Purchase
                        </button>
                      : <button 
                        className="purchaseButton"
                        disabled = {true}
                        name = {book.id}
                        value = {book.price}
                        onClick={(event) => {
                          console.log("already purchased!")
                        }}
                        >
                          Purchasing
                        </button>
                    }
                </td>
                <td>  
                    { !book.hold
                      ? null

                      : !book.sellerok
                        ? <button 
                          className="acceptButton"
                          name = {book.id}
                          value = {book.price}
                          onClick={(event) => {
                            //this.props.accept(event.target.name, event.target.value)
                            this.props.accept(event.target.name)
                          }}
                        >
                            Accept
                          </button>
                        : <button 
                          className="acceptButton"
                          name = {book.id}
                          value = {book.price}
                          disabled = {true}
                          onClick={(event) => {
                            console.log("seller already Accepted!")
                          }}
                          >
                            Seller Accepted
                          </button>
                      
                      }
                </td>
                <td>  
                    { !book.hold
                      ? null

                      : !book.buyerok
                        ? <button 
                          className="acceptButton"
                          name = {book.id}
                          value = {book.price}
                          
                          onClick={(event) => {
                            this.props.accept(event.target.name)
                          }}
                        >
                            Accept
                          </button>
                        : <button 
                          className="acceptButton"
                          name = {book.id}
                          value = {book.price}
                          disabled = {true}
                          onClick={(event) => {
                            console.log("buyer already Accepted!")
                          }}
                          >
                            Buyer Accepted
                          </button>
                      
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

export default MyBooks; 