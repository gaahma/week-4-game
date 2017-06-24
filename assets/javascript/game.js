var game = {
	characterList: [],
	player: undefined,
	defender: undefined,
	init: function(){				 	//name, hp, attack, counterAttack, image
		this.characterList.push(game.character("Luke", "Skywalker", 150, 8, 15,"assets/images/skywalker.jpg"));
		this.characterList.push(game.character("Obiwan", "Kenobi", 120, 12, 20,"assets/images/kenobi.jpg"));
		this.characterList.push(game.character("Darth", "Vader", 180, 3, 30, "assets/images/vader.jpg"));
		this.characterList.push(game.character("Kylo", "Ren", 100, 20, 10, "assets/images/ren.jpg"));
		for (var i = 0; i < game.characterList.length; i++){
			$("#player").append(game.characterList[i].card);
		}
	},
/*
	Applies the rules of the rpg to the player and defender objects
*/
	fight: function(){
		var attack = game.player.attack;
		var counterAttack = game.defender.counterAttack;
		game.defender.hp -= attack;
		game.player.attack += game.player.baseAttack;
		if (game.defender.hp > 0){
			game.player.hp -= counterAttack;
			game.player.updateHP();
			game.defender.updateHP();
			game.attackLog(attack, counterAttack);

		} else {
			if (game.characterList.length === 0){
				game.gameOver("win");
			} 
			else {
				game.defender.die();
			}
		} 
		if(game.player.hp <= 0){
			game.gameOver("lose");
		}
	},

	attackLog: function(attack, counter){
		$("#attackLog").html("<p>You attacked " + game.defender.name + " for " 
			+ attack + " damage" + "<br>" + game.defender.name
			+ " attacked you back for " + counter + " damage.</p>");
	},

	gameOver: function(winLoss){
		$("#attack").off("click");
		$("#attackLog").html("You " + winLoss + "!");
		$("#endGame").html("<button class='btn btn-default' id='reset'>Play again</button>");
	},

/*
	This function returns a character object with the properties passed.
*/
	character: function(name1, name2, HP, attackPower, counterAttackPower, imgSrc){
		var character = {
			lastName: name2,
			name: name1 + " " + name2,
			hp: HP,
			attack: attackPower,
			counterAttack: counterAttackPower,
			baseAttack: attackPower,
			img: imgSrc,
			card: undefined,		//these 3 items get defined at the end of the funciton
			characterID: undefined,
			hpID: undefined,

			updateHP: function(){
				$(this.hpID).html(this.hp);
			},

			makeIDs: function(){
				this.characterID = "#" + this.lastName;
				this.hpID = "#" + this.lastName + "HP";
			},

			die: function(){
				$("#defender").empty();
				$("#attackLog").html("You defeated " + game.defender.name + 
									 "<br>Select another opponent");
				game.defender = undefined;
			},
			/*
				this function creates the html necessary to display 
				the character name, image, and hp.
			*/
			makeCard: function(character){
				var characterCard = $("<div>");
				var characterName = $("<div>");
				var characterImage = $("<img>");
				var characterHP = $("<div>");
				// name and hp html
				characterName.html(character.name);
				characterHP.html(character.hp);
				//classes and attributes
				characterCard.addClass("character-card select-character");
				characterName.addClass("text-center");
				characterImage.addClass("img-responsive character-image");
				characterHP.addClass("text-center");

				characterCard.attr("name", character.name);
				characterImage.attr({src: character.img, alt: character.name});
				characterHP.attr("id", character.lastName + "HP");
				//append to the "card"
				characterCard.append(characterName, characterImage, characterHP);

				return characterCard;
			}
		}	//end of var character declaration		
			character.card = character.makeCard(character);
			character.makeIDs();
			return character;		
	}
}



$(document).ready(function(){
	game.init();

/*
	This function handles the initial character selection.
	Once clicked, this function compares the name attribute
	of the element to the names of all the characters.

	When it finds it, that player become the player, and is removed
	from the characterList.

	The rest of the characters get the enemy-character class, 
	and get appended to #enemies div

	The click function is then turned off to prevent subsequent clicks
*/
	$(".character-card").on("click", function(){
		for (var i = 0; i < game.characterList.length; i++){
			if ($(this).attr("name") === game.characterList[i].name){
				game.player = game.characterList[i];
				game.player.card.addClass("player-character");
				var index = i;
			} else {
				game.characterList[i].card.addClass("enemy-character");
			}
		}
		game.characterList.splice(index, 1);
		$("#enemies").append($(".enemy-character"));
		$("#attackLog").html("Select your opponent");
		$(".character-card").off("click");
	});

/*
	This allows the user to select an opponent character, but only
	if game.defender is undefined when clicked.  
*/
	$(document).on("click", ".enemy-character", function(){
		if (game.defender !== undefined){  //if a defender is already selecter
			return;							//do nothing
		}
		$("#defender").append($(this));
		for (var i = 0; i < game.characterList.length; i++){
			if ($(this).attr("name") === game.characterList[i].name){
				game.defender = game.characterList.splice(i,1)[0];
				break;
			}		
		}
		game.defender.card.addClass("defender");
		$("#attackLog").html("Fight!!!");
	});

	$("#attack").on("click", function(){
		if (game.defender === undefined)	//if no defender selected
			return;							//do nothing

		game.fight();						//otherwise, fight!
	});
/*
	Pressing the Play Again button refreshes the page
*/
	$(document).on("click", "#reset", function(){
		window.location.reload();
	});
});


