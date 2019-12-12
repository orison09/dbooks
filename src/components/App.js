import React, { Component } from 'react';
import ReactDOM from "react-dom";
import Web3 from 'web3';
import logo from '../logo.png';
import Dbooks from '../abis/Dbooks.json';
import Navbar from './navbar';
import Main from './Main';
import ManagerPage from './ManagerPage';
import MyBooks from './MyBooks';
import MessageComp from './MessageComp';
import { BrowserRouter as Router, Route } from 'react-router-dom';


class App extends Component {
    
  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()

  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    //Drop non dapp browsers
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const netID = await web3.eth.net.getId()
    const netData = Dbooks.networks[netID]
    if(netData) {
      const dbooks = web3.eth.Contract(Dbooks.abi, netData.address)
      this.setState({ dbooks })
      const bookCount = await dbooks.methods.bookCount().call()
      
      this.setState({ bookCount })
      //
      for (var i = 1; i <= bookCount; i++){
        const book = await dbooks.methods.books(i).call()
        this.setState({
          books: [...this.state.books, book]
        })
      }
      this.setState({ loading: false })
      console.log(this.state.books)
    } else {
        window.alert('Dbooks is not deployed to detected network.')
    }

  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      bookCount: 0,
      books: [],
      loading: true
    }

    this.createBook = this.createBook.bind(this)
    this.requestBook = this.requestBook.bind(this)
    this.discount = this.discount.bind(this)
    this.purchaseBook = this.purchaseBook.bind(this)
    this.accept = this.accept.bind(this)
    this.deposit = this.deposit.bind(this)
  }

  createBook(name, edition, price) {
    this.setState({ loading : true})
    this.state.dbooks.methods.createBook(name, edition, price).send({ from: this.state.account , value : price})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  requestBook(id) {
    this.setState({ loading : true})
    this.state.dbooks.methods.requestBook(id).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

   discount(id, price) {
    this.setState({ loading : true})
    this.state.dbooks.methods.discount(id).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  purchaseBook(id, price) {
    this.setState({ loading : true})
    this.state.dbooks.methods.purchaseBook(id).send({ from: this.state.account, value : price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

   accept(id, price) {
    this.setState({ loading : true})
    this.state.dbooks.methods.accept(id).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  deposit(id, price) {
    this.setState({ loading : true})
    this.state.dbooks.methods.deposit(id).send({ from: this.state.account, value : price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }


  render() {
    return (
      <Router>
        <Route exact path='/'>
          <div>
            <Navbar account={this.state.account} />
              <div className="container-fluid mt-5">
              <div className="row">
                <main role="main" className="col-lg-12 d-flex">
                  {this.state.loading 
                    ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                    : <Main 
                        thisaccount = {this.state.account}
                        books = {this.state.books}
                        createBook = {this.createBook}
                        requestBook = {this.requestBook} 
                        discount = {this.discount}
                        purchaseBook = {this.purchaseBook} 
                        accept = {this.accept}
                        deposit = {this.deposit}  /> }
                  </main>
              </div>
            </div>
          </div>
        </Route>
        <Route exact path='/ManagerPage'>
          <div>
            <Navbar account={this.state.account} />
              <div className="container-fluid mt-5">
              <div className="row">
                <main role="main" className="col-lg-12 d-flex">
                  {this.state.loading 
                    ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                    : <ManagerPage 
                        thisaccount = {this.state.account}
                        books = {this.state.books}
                        createBook = {this.createBook}
                        requestBook = {this.requestBook} 
                        discount = {this.discount}
                        purchaseBook = {this.purchaseBook} 
                        accept = {this.accept}
                        deposit = {this.deposit}  /> }
                  </main>
              </div>
            </div>
          </div>
        </Route>
        <Route exact path='/MyBooks'>
          <div>
            <Navbar account={this.state.account} />
              <div className="container-fluid mt-5">
              <div className="row">
                <main role="main" className="col-lg-12 d-flex">
                  {this.state.loading 
                    ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                    : <MyBooks 
                        thisaccount = {this.state.account}
                        books = {this.state.books}
                        createBook = {this.createBook}
                        requestBook = {this.requestBook} 
                        discount = {this.discount}
                        purchaseBook = {this.purchaseBook} 
                        accept = {this.accept}
                        deposit = {this.deposit}  /> }
                  </main>
              </div>
            </div>
          </div>
        </Route>
        <Route exact path='/Messages'>
          <div>
            <Navbar account={this.state.account} />
              <div className="container-fluid mt-5">
              <div className="row">
                <main role="main" className="col-lg-12 d-flex">
                  {this.state.loading 
                    ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                    : <MessageComp 
                        thisaccount = {this.state.account}
                        books = {this.state.books}
                        createBook = {this.createBook}
                        requestBook = {this.requestBook} 
                        discount = {this.discount}
                        purchaseBook = {this.purchaseBook} 
                        accept = {this.accept}
                        deposit = {this.deposit}  /> }
                  </main>
              </div>
            </div>
          </div>
        </Route>
      </Router>
    );
  }
}

export default App;
