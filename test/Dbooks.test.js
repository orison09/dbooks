const Dbooks = artifacts.require('./Dbooks.sol')

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Dbooks', ([deployer, seller, buyer]) => {
	let dbooks 

	before(async () => {
		dbooks = await Dbooks.deployed()
	})

	describe('deployment', async () => {
		it('deploys succesfully', async () => {
			const address = await dbooks.address
			assert.notEqual(address,0x0)
			assert.notEqual(address,'')
			assert.notEqual(address,null)
			assert.notEqual(address,undefined)
		})


	it('has a name', async () =>{
		const name = await dbooks.name()
		assert.equal(name, 'Dbooks Application')
	})
  })

	describe('books', async () => {
		let result, bookCount

		before(async () => {
		result = await dbooks.createBook('Don Quijote', 1, web3.utils.toWei('1', 'Ether'), {from: seller })
		bookCount = await dbooks.bookCount()
		//bookEdition = await dbooks.bookCount()
		})


		it('creates new book', async () =>{
			//Success
			assert.equal(bookCount, 1)
			const event = resultd.logs[0].args
			assert.equal(event.id.toNumber(), bookCount.toNumber(),'id is correct')
			assert.equal(event.name, 'Don Quijote', 'name is correct')
			assert.equal(event.edition, 1, 'edition is correct')
			assert.equal(event.price, '1000000000000000000','price is correct')
			assert.equal(event.owner, seller, 'is correct')
			assert.equal(event.hold, false, 'not on hold is correct')
			assert.equal(event.purchased, false, 'not purchased is correct')

			//Fails name 
			await await dbooks.createBook('', 1, web3.utils.toWei('1', 'Ether'), {from: seller }).should.be.rejected;
			//Fails price
			await await dbooks.createBook('Don Quijote', 1, 0, {from: seller }).should.be.rejected;
		})

		it('shows all books', async () =>{
			const book = await dbooks.books(bookCount)
			assert.equal(book.id.toNumber(),bookCount.toNumber(),'id is correct')
			assert.equal(book.name, 'Don Quijote', 'name is correct')
			assert.equal(book.edition, 1, 'edition is correct')
			assert.equal(book.price, '1000000000000000000','price is correct')
			assert.equal(book.owner, seller, 'is correct')
			assert.equal(book.hold, false, 'not on hold is correct')
			assert.equal(book.purchased, false, 'purchased is correct')
		})

		it('sell a book', async () =>{
			//Track seller balance
			let oldSellerBalance
			oldSellerBalance = await web3.eth.getBalance(seller)
			oldSellerBalance = new web3.utils.BN(oldSellerBalance)

			// Purhcase by byer
			result = await dbooks.purchaseBook(bookCount, {from : buyer, value: web3.utils.toWei('1', 'Ether')})

			// Check log
			assert.equal(bookCount, 1)
			const event = result.logs[0].args
			assert.equal(event.id.toNumber(),bookCount.toNumber(),'id is correct')
			assert.equal(event.name, 'Don Quijote', 'name is corret')
			assert.equal(event.price, '1000000000000000000','price is correct')
			assert.equal(event.owner, buyer, 'is correct')
			assert.equal(event.purchased, true, 'purchased is correct')

			//Track new seller balance
			let newSellerBalance
			newSellerBalance = await web3.eth.getBalance(seller)
			newSellerBalance = new web3.utils.BN(newSellerBalance)

			let price 
			price = web3.utils.toWei('1','Ether')
			price = new web3.utils.BN(price)

			const expectedBalance = oldSellerBalance.add(price)
			assert.equal(newSellerBalance.toString(), expectedBalance.toString())

			//buy non existing book fails
			await dbooks.purchaseBook(99, 1, {from : buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
			//buyer has no ether
			await dbooks.purchaseBook(bookCount, 1, {from : buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;
			// cannot purchase twice
			await dbooks.purchaseBook(bookCount, 1, {from : deployer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
			// cannot purchase bu buyer
			await dbooks.purchaseBook(bookCount, 1, {from : buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
				
		})

  })

})