pragma solidity ^0.5.2;

contract Dbooks {
    string public name;
    uint public bookCount = 0;
    address payable handler;
    mapping(uint => Book) public books;

    struct Book {
        uint id;
        string name;
        uint edition;
        uint price;
        uint discount;
        address payable owner;
        address payable buyer;
        bool hold;
        bool purchased;
        bool sellerok;
        bool buyerok;
    }

    event BookCreated(
        uint id,
        string name,
        uint edition,
        uint price,
        uint discount,
        address payable owner,
        address payable buyer,
        bool hold,
        bool purchased,
        bool sellerok,
        bool buyerok
    );

    event BookRequested(
        uint id,
        string name,
        uint edition,
        uint price,
        uint discount,
        address payable owner,
        address payable buyer,
        bool hold,
        bool purchased,
        bool sellerok,
        bool buyerok
    );
    
        event BookPurchased(
        uint id,
        string name,
        uint edition,
        uint price,
        uint discount,
        address payable owner,
        address payable buyer,
        bool hold,
        bool purchased,
        bool sellerok,
        bool buyerok
    );
    
    event BuyerAccepted(
        uint id,
        string name,
        uint edition,
        uint price,
        uint discount,
        address payable owner,
        address payable buyer,
        bool hold,
        bool purchased,
        bool sellerok,
        bool buyerok
    );
    
    event SellerAccepted(
        uint id,
        string name,
        uint edition,
        uint price,
        uint discount,
        address payable owner,
        address payable buyer,
        bool hold,
        bool purchased,
        bool sellerok,
        bool buyerok
    );
    
    constructor() public payable{
        name = "Dbooks Application";
        handler = msg.sender;
    }

    function 
        createBook(string memory _name, uint _edition, uint _price)
        public
        payable {
        //Require valid name
        require(bytes(_name).length > 0);
        // Require valid price
        require(_edition > 0);
        // Require a valid number for edition
        require(_price > 0);
        //The variable for bookcount increases by 1
        bookCount ++;
        
        // rquire ether
        require(msg.value >= _price);
        
        //Pay the price of the book
        handler.transfer(msg.value);
        
        //address(_deployer).transfer(_price);
        
        //Create Book
        books[bookCount] = Book(bookCount, _name, _edition, _price, 0, msg.sender, 0x0000000000000000000000000000000000000000, false, false, false, false);

        //Event Book
        emit BookCreated(bookCount, _name, _edition, _price, 0,  msg.sender, 0x0000000000000000000000000000000000000000, false, false, false, false);
    }


    function requestBook(uint _id) public {
        //Get book
        Book memory _book = books[_id];
        //Make sure id is valid
        require(_book.id > 0 && _book.id <= bookCount);
        //Require it is not on hold
        require(!_book.hold);
        // Require buyer is not seller
        require(_book.owner != msg.sender);
        
        //Mark on HOLD
        _book.hold = true;
        //SEt buyer
        _book.buyer = msg.sender;
        //Update
        books[_id] = _book;

        //Trigger event
        emit BookRequested(_book.id, _book.name, _book.edition, _book.price, _book.discount, _book.owner, msg.sender, true, false, false, false);
    }
    
    
    function discount(uint _id, uint _discount) public {
        //Get book
        Book memory _book = books[_id];
        //Require that book is requested
        require(_book.hold);
        //Make sure discount is valid
        require(_discount > 0 && _discount <= _book.price);
        //Set Discount
        _book.discount = _discount;
        //Update
        books[_id] = _book;
        
    }

    function purchaseBook(uint _id) public payable{
        //Get book
        Book memory _book = books[_id];
        //Get owner
        address payable _seller = _book.owner;
        //Make sure id is valid
        require(_book.id > 0 && _book.id <= bookCount);
        //Require Ether
        require(msg.value >= _book.price - _book.discount);
        //Require it is not on hold
        require(_book.hold);
        // Require buyer is not seller
        require(_seller != msg.sender);
        
        //Mark as Purchased 
        _book.purchased = true;
        //Update
        books[_id] = _book;

        //Pay the price of the book
        handler.transfer(msg.value);

        //Trigger event
        emit BookPurchased(_book.id, _book.name, _book.edition, _book.price, _book.discount, _book.owner, _book.buyer, true, true, false, false);
    }

    function accept(uint _id) public {
        //Get book
        Book memory _book = books[_id];
        //Require that book is purchased
        require(_book.purchased);
        //Get owner
        address payable _seller = _book.owner;
        //Get buyer
        address payable _buyer = _book.buyer;
        
        if (msg.sender == _buyer){
            _book.buyerok = true;
            //Update
            books[_id] = _book;
            //Trigger event
            emit BuyerAccepted(_book.id, _book.name, _book.edition, _book.price, _book.discount, _book.owner, _book.buyer, true, true, true, _book.sellerok);
        } else if (msg.sender == _seller){
            _book.sellerok = true;
            //Update
            books[_id] = _book;
            //Trigger event
            emit SellerAccepted(_book.id, _book.name, _book.edition, _book.price, _book.discount, _book.owner, _book.buyer, true, true, _book.buyerok, true);
        }
    }
    
    function deposit(uint _id) public payable{
        //Get book
        Book memory _book = books[_id];
        //Get owner
        address payable _seller = _book.owner;
        //Calculate fee
        uint fee = _book.price / 100;
        //Require Ether
        require(msg.value >= _book.price * 2 - fee);
        
        uint amount = msg.value;
        uint payment = amount - fee;
        _seller.transfer(payment);
        }

    function abortReq(uint _id) public payable{
        //Get book
        Book memory _thisbook = books[_id];
         //Require that book is requested
        require(_thisbook.hold);
        //Get owner
        address payable _seller = _thisbook.owner;
        //Calculate fee
        uint fee = _thisbook.price;
        //Require Ether
        require(msg.value >= _thisbook.price);

        //Mark as Not Requested 
        _thisbook.hold = false;
        //Mark Discount to zero 
        _thisbook.discount = 0;
        //Drop buye
        _thisbook.buyer = 0x0000000000000000000000000000000000000000;
        //Update
        books[_id] = _thisbook;
        
        _seller.transfer(fee);
    }
}