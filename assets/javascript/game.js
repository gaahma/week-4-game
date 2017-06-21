var characterList = [];
var player = undefined;
var defender = undefined;

var game = {
	init: function(){				 	//name, hp, attack, counterAttack, image
		characterList.push(character("Luke", "Skywalker", 150, 10, 5,  "assets/images/skywalker.jpg"));
		characterList.push(character("Obiwan", "Kenobi", 120, 15, 10, "assets/images/kenobi.jpg"));
		characterList.push(character("Darth", "Vader", 180, 15, 10, "assets/images/vader.jpg"));
		characterList.push(character("Han", "Solo", 100, 20, 20, "assets/images/solo.jpg"));
		for (var i = 0; i < characterList.length; i++){
			$("#selection").append(characterList[i].card);
		}
	},

	attack: function(){
		defender.hp -= player.attack;
		player.attack += player.baseAttack;
		if (defender.hp > 0){
			player.hp -= defender.counterAttack;
			player.updateHP();
			defender.updateHP();
		} else {
			defender.die();
		}
	}
}

function character(name1, name2, HP, attackPower, counterAttackPower, imgSrc){
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
			defender = undefined;
		}
	}
	character.card = characterCard(character);
	character.makeIDs();
	return character;
}

function characterCard(character){
	var characterCard = $("<div>");
	var characterName = $("<div>");
	var characterImage = $("<img>");
	var characterHP = $("<div>");
	// name and hp html
	characterName.html(character.name);
	characterHP.html(character.hp);
	//classes and attributes
	characterHP.attr("id", character.lastName + "HP");
	characterCard.addClass("character-card select-character");
	characterCard.attr("name", character.name);
	characterName.addClass("text-center");
	characterImage.addClass("img-responsive character-image");
	characterHP.addClass("text-center");
	//characterHP.attr("id", );
	characterImage.attr("src", character.img);
	characterImage.attr("alt", character.name);
	//append to the "card"
	characterCard.append(characterName);
	characterCard.append(characterImage);
	characterCard.append(characterHP);

	return characterCard;
}

$(document).ready(function(){
	game.init();

	//This function handles only the initial character selection
	$(".character-card").on("click", function(){
		for (var i = 0; i < characterList.length; i++){
			if ($(this).attr("name") === characterList[i].name){
				player = characterList[i];
				player.card.addClass("player-character");
				var index = i;
			} else {
				characterList[i].card.addClass("enemy-character");
			}
		}
		characterList.splice(index, 1);
		$("#player").append($(".player-character"));
		$("#enemies").append($(".enemy-character"));
		$(".character-card").off("click");
	});


	$(document).on("click", ".enemy-character", function(){
		if (defender !== undefined){
			return;
		}
		$("#defender").append($(this));
		for (var i = 0; i < characterList.length; i++){
			if ($(this).attr("name") === characterList[i].name){
				defender = characterList[i];
				characterList.splice(i,1);
				break;
			}		
		}
	});

	$("#attack").on("click", function(){
		if (defender === undefined)
			return;
		game.attack();
	});


});


