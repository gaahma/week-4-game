var game = {
	characterList: [],
	player: undefined,
	defender: undefined,
	init: function(){				 	//name, hp, attack, counterAttack, image
		this.characterList.push(game.character("Luke", "Skywalker", 150, 8, 15,  "assets/images/skywalker.jpg"));
		this.characterList.push(game.character("Obiwan", "Kenobi", 120, 12, 20, "assets/images/kenobi.jpg"));
		this.characterList.push(game.character("Darth", "Vader", 180, 10, 30, "assets/images/vader.jpg"));
		this.characterList.push(game.character("Kylo", "Ren", 100, 20, 10, "assets/images/ren.jpg"));
		for (var i = 0; i < game.characterList.length; i++){
			$("#selection").append(game.characterList[i].card);
		}
	},

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
			game.defender.die();
			if (game.characterList.length === 0){
				game.gameOver();
			}
		} 
		if(game.player.hp <= 0){
			$("#attackLog").html("You lost");
			game.gameOver();
		}
	},

	attackLog: function(attack, counter){
		console.log("reached");
		$("#attackLog").html("<p>You attacked " + game.defender.name + " for " 
			+ attack + " damage" + "<br>" + game.defender.name
			+ " attacked you back for " + counter + " damage.</p>");
	},

	gameOver: function(){
		console.log("reached game over");
		$("#attack").off("click");
		$("#endGame").html("<button id='reset'>Play again</button>");
	},

	character: function(name1, name2, HP, attackPower, counterAttackPower, imgSrc){
		var character = {
			lastName: name2,
			name: name1 + " " + name2,
			hp: HP,
			attack: attackPower,
			counterAttack: counterAttackPower,
			baseAttack: attackPower,
			img: imgSrc,
			card: undefined,
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
				$("#attackLog").html("You defeated " + game.defender.name);
				game.defender = undefined;
			},

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
		}			
			character.card = character.makeCard(character);
			character.makeIDs();
			return character;		
	}
}



$(document).ready(function(){
	game.init();

	//This function handles only the initial character selection
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
		$("#player").append($(".player-character"));
		$("#enemies").append($(".enemy-character"));
		$(".character-card").off("click");
	});


	$(document).on("click", ".enemy-character", function(){
		if (game.defender !== undefined){
			return;
		}
		$("#defender").append($(this));
		for (var i = 0; i < game.characterList.length; i++){
			if ($(this).attr("name") === game.characterList[i].name){
				game.defender = game.characterList[i];
				game.characterList.splice(i,1);
				break;
			}		
		}
		game.defender.card.addClass("defender");
		$("#attackLog").empty();
	});

	$("#attack").on("click", function(){
		if (game.defender === undefined)
			return;
		game.fight();
	});

	$(document).on("click", "#reset", function(){
		console.log("reached refresh");
		window.location.reload();
	});
});

