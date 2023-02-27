pragma solidity ^0.8.1;

contract Chance {
    struct game_info {
        address creator;
        address joiner;
        uint256 amount;
        bool is_finished;
        address winner;
    }

    uint256 game_id;
    address _owner;

    mapping(uint256 => game_info) game_result;

    uint256[] games;

    event create_new_game(address _creator, uint256 _amount);
    event join_to_game(address _joiner, uint256 _amount);

    constructor() {
        game_id = 0;
        _owner = msg.sender;
    }

    function create_game() external payable {
        require(msg.value > 0, "your value should be greater than zero");
        require(msg.sender.balance >= msg.value, "your balance is not enough");

        game_id++;
        game_info memory game_data;
        game_data.creator = msg.sender;
        game_data.amount = msg.value;
        game_data.is_finished = false;

        game_result[game_id] = game_data;
        games.push(game_id);

        emit create_new_game(msg.sender, msg.value);
    }

    function join_game(uint256 _game_id) external payable {
       
        require(game_result[_game_id].is_finished == false, "this game had been palyed");
        require(msg.sender != game_result[_game_id].creator, "you can't play with yourself");
        require(game_result[_game_id].amount == msg.value, "choose the correct amount");

        require(
            msg.sender.balance >= game_result[_game_id].amount,
            "your balance is not enough"
        );

        game_result[_game_id].joiner = msg.sender;

        uint256 winner_number = random();

        if (winner_number == 1) {
            game_result[_game_id].winner = game_result[_game_id].creator;
            game_result[_game_id].is_finished = true;
        } else if (winner_number == 0) {
            game_result[_game_id].winner = game_result[_game_id].joiner;
            game_result[_game_id].is_finished = true;
        }

        payable(game_result[_game_id].winner).transfer((3 * game_result[_game_id].amount) / 2);
        emit join_to_game(msg.sender, game_result[_game_id].amount);
    }

    function get_games_id() public view returns (uint256[] memory) {
        return games;
    }

    function get_game_info(uint256 _id) public view returns (game_info memory) {
        return game_result[_id];
    }

    function GetBalance(address add) public view returns(uint) {
        return add.balance;
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        msg.sender
                    )
                )
            ) % 2;
    }
}
