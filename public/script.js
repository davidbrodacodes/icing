//TEST CONSTS
const body = document.getElementById('body');

//UI CONSTS
const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
const statsSelect = document.getElementById('statsSelect');
const dfUI = document.getElementById('dfUI'); // ENTIRE D OR F DIV TO BE HIDDEN IF GOALIE SELECTED
const dfStat = document.getElementsByClassName('dfStat'); //HTML COLLECTION OF D/F STATS CHECBOXES TO BE UNCHECKED IF GOALIE SELECTED
const GP = document.getElementById('GP'); // GAMES PLAYED
const G = document.getElementById('G'); // GOALS
const A = document.getElementById('A'); // ASSISTS
const P = document.getElementById('P'); // POINTS
const plusMinus = document.getElementById('plusMinus'); // +/-
const GWG = document.getElementById('GWG'); // GAME WINNING GOALS
const otG = document.getElementById('otG'); // OVERTIME GOALS
const pim = document.getElementById('pim'); // PENALTY MINUTES
const ppg = document.getElementById('ppg'); // POWER PLAY GOALS
const ppp = document.getElementById('ppp'); // POWER PLAY POINTS

const goalieUI = document.getElementById('goalieUI'); // ENTIRE GOALIE DIV TO BE HIDDEN IF D OR F SELECTED
const gStat = document.getElementsByClassName('gStat'); //HTML COLLECTION OF G STATS CHECBOXES TO BE UNCHECKED IF D/F SELECTED
const W = document.getElementById('W'); // WINS
const L = document.getElementById('L'); // LOSSES
const SV = document.getElementById('SV'); // SAVES PERCENTAGE
const otL = document.getElementById('otL'); // OVER TIME LOSSES
const GAA = document.getElementById('GAA'); // GOALS ACQUIRED AVG
const SO = document.getElementById('SO'); // SHUT OUTS



//OUTPUT CONSTS
const playerName = document.getElementById('playerName');
const playoffPlate = document.getElementById('playoffPlate');
const downloadBtn = document.getElementById('downloadBtn');
const output = document.getElementById('output');
const nameInput = document.getElementById('nameInput');
const teamSelect = document.getElementById('teamSelect');
const playerSelect = document.getElementById('playerSelect');
const headshotSrc = document.getElementById('headshotSrc');
const teamLogo = document.getElementById('teamLogo');
const playerNum = document.getElementById('playerNum');
const playerNumBg = document.getElementById('playerNumBg');

const statCat = document.getElementsByClassName('statCat');
const statBlock = document.getElementsByClassName('statBlock');
const gamesPlayedNum = document.getElementById('gamesPlayedNum');
const playerGoalsNum = document.getElementById('playerGoalsNum');
const playerAssistsNum = document.getElementById('playerAssistsNum');
const playerPointsNum = document.getElementById('playerPointsNum');
const playerSeason = document.getElementById('playerSeason');
//OUTPUT CONSTS - D OR F
const playerPlusMinusNum = document.getElementById('playerPlusMinusNum');
const playerGWGNum = document.getElementById('playerGWGNum');
const playerOTGNum = document.getElementById('playerOTGNum');
const playerPIMNum = document.getElementById('playerPIMNum');
const playerPPGNum = document.getElementById('playerPPGNum');
const playerPPPNum = document.getElementById('playerPPPNum');

//OUTPUT CONSTS - G
const playerWNum = document.getElementById('playerWNum');
const playerLNum = document.getElementById('playerLNum');
const playerSVNum = document.getElementById('playerSVNum');
const playerOTNum = document.getElementById('playerOTNum');
const playerGAANum = document.getElementById('playerGAANum');
const playerSONum = document.getElementById('playerSONum');


//TEAM COLOUR PALETTE
const teamColors = {
    1: '#bd2c2f', //new jersey devils
    2: '#215196', //new york islanders
    3: '#1437a1', //new york rangers
    4: '#e55728', //philadelphia flyers
    5: '#000000', //pittsburgh penguins
    6: '#f2b744', //boston bruins
    7: '#0b2551', //buffalo sabres
    8: '#a02d32', //montreal canadiens
    9: '#000000', //ottawa senators
    10: '#082058', //toronto maple leafs
    11: '#', //
    12: '#bd2c2f', //carolina hurricanes
    13: '#0b1e40', //florida panthers
    14: '#0c2764', //tampa bay lightning
    15: '#0b1e3f', //washington capitals
    16: '#000000', //chicago blackhawks
    17: '#bd2d2f', //detroit red wings
    18: '#0b1d3f', //nashville predators
    19: '#0f2e81', //st louis blues
    20: '#bd2d2f', //calgary flames
    21: '#672b3d', //colorado avalanche
    22: '#0b1d3e', //edmonton oilers
    23: '#0d1c2b', //vancouver canucks
    24: '#bf4f2e', //anaheim ducks
    25: '#2b6649', //dallas stars
    26: '#000000', //los angeles kings
    27: '#', //
    28: '#2e6b73', //san jose sharks
    29: '#0b2551', //columbus blue jackets
    30: '#1d4832', //minnesota wild
    52: '#0b1e3f', //winnipeg jets
    54: '#353f42', //vegas golden knights
    55: '#041424', //seattle kraken
    59: '#010101', //utah hc
};

//GLOBAL FUNCTIONS



function updateStatDivVisibility() {
    allCheckboxes.forEach(cb => {
        const div = document.getElementById(cb.name);
        if (div) {
            div.style.display = cb.checked ? '' : 'none';
        }
    });
}

//HIDE ALL STATS TO LATER CHECK WHICH STATS ARE CHECKED IN CHECKBOXES
document.addEventListener('DOMContentLoaded', () => {
    dfUI.style.display = "none";
    goalieUI.style.display = "none";
    playoffPlate.style.display = "none";
    allCheckboxes.forEach(cb => {
        const div = document.getElementById(cb.name);
        if (div) div.style.display = 'none';
    });
    statsSelect.addEventListener('change', () => {
        if (statsSelect.value === "playoffs") {
            playoffPlate.style.display = "";
        } else {
            playoffPlate.style.display = "none";
        }
    })
});

allCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateStatDivVisibility);
});
//Array.prototype.forEach.call(statBlock, stat => stat.style.display = 'none');

//RETIREVE TEAM ROSTER
teamSelect.addEventListener('change', () => {
    const selectedTeam = teamSelect.value;

    fetch(`/api/roster/${selectedTeam}`)
         .then(response => response.json())
         .then(data => {
            playerSelect.innerHTML = '<option value="" selected disabled></option>';

            const createOptgroup = (array, label) => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = label;
                playerSelect.appendChild(optgroup);

                array.forEach(player => {
                    const option = document.createElement('option');
                    option.value = player.id;
                    option.innerText = `${player.firstName.default} ${player.lastName.default}`;
                    playerSelect.appendChild(option);
                })
            }

            createOptgroup(data.goalies, "Goalies");
            createOptgroup(data.defensemen, "Defensemen");
            createOptgroup(data.forwards, "Forwards");

         })
        .catch(error => console.log(error));
})

//UPDATE GRAPHICS
playerSelect.addEventListener('change', () => {
    console.log(statCat);
    console.log(playerSelect.value);
    const selectedPlayer = playerSelect.value;

    fetch(`/api/player/${selectedPlayer}`)
         .then(response => response.json())
         .then(data => {
            console.log(data);
            //FIRST UPDATE GRAPHICS APPLIED FOR ALL PLAYERS
            playerName.innerText = `${data.firstName.cs || data.firstName.default} ${data.lastName.cs || data.lastName.default}`;
            playerName.style.color = teamColors[data.currentTeamId];
            headshotSrc.src = `img/players/${data.fullTeamName.default}/${data.lastName.default}_${data.firstName.default}.png`;
            teamLogo.src = `img/teams/${data.fullTeamName.default}.png`;
            playerNum.innerText = data.sweaterNumber;

            //SELECT REGULAR SEASON OR PLAYOFFS STATS
            const seasonType = statsSelect.value;
            const stats = data.featuredStats[seasonType].subSeason;

            gamesPlayedNum.innerHTML = `${stats.gamesPlayed}`;

            //UPDATE TEAM COLORS
            Array.prototype.forEach.call(statCat, stat => stat.style.color = teamColors[data.currentTeamId]);

            
                

            //THEN CHECK IF GOALIE IS DISPLAYED OR NOT AND ADJUST STAT CATEGORIES
            const position = data.position;
            if (position === "G") {
               dfUI.style.display = 'none';
               goalieUI.style.display = '';
                //MAKE SURE ALL D OR F STATS ARE UNCHECKED
               Array.prototype.forEach.call(dfStat, stat => stat.checked = false);

               W.checked = true;
               L.checked = true;
               SV.checked = true;

               playerWNum.innerHTML = `${stats.wins}`;
               playerLNum.innerHTML = `${stats.losses}`;
               playerSVNum.innerHTML = `${stats.savePctg.toFixed(2)}`;
               playerOTNum.innerHTML = `${stats.otLosses}`;
               playerGAANum.innerHTML = `${stats.goalsAgainstAvg.toFixed(2)}`;
               playerSONum.innerHTML = `${stats.shutouts}`;

               
                
            } else {
               goalieUI.style.display = 'none';
                dfUI.style.display = '';
                //MAKE SURE ALL G STATS ARE UNCHECKED
               Array.prototype.forEach.call(gStat, stat => stat.checked = false);

               G.checked = true;
               A.checked = true;
               P.checked = true;

               playerGoalsNum.innerHTML = `${stats.goals}`;
               playerAssistsNum.innerHTML = `${stats.assists}`;
               playerPointsNum.innerHTML = `${stats.points}`;

               playerPlusMinusNum.innerHTML = `${stats.plusMinus}`;
               playerGWGNum.innerHTML = `${stats.gameWinningGoals}`;
               playerOTGNum.innerHTML = `${stats.otGoals}`;
               playerPIMNum.innerHTML = `${stats.pim}`;
               playerPPGNum.innerHTML = `${stats.powerPlayGoals}`;
               playerPPPNum.innerHTML = `${stats.powerPlayPoints}`;

            }

            updateStatDivVisibility();

            const seasonNumber = data.featuredStats.season.toString();
            const formattedSeason = `${seasonNumber.slice(0, 4)}/${seasonNumber.slice(4)}`
            playerSeason.innerHTML = `Sezóna: ${formattedSeason}`;

         })
        .catch(error => console.log(error));

        const statCheckboxes = document.querySelectorAll('input[type="checkbox"]');

        statCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const targetDivId = checkbox.name;
                const targetDiv = document.getElementById(targetDivId);
        
                if (targetDiv) {
                    targetDiv.style.display = checkbox.checked ? '' : 'none';
                }
            });
        });

});



//DOWNLOAD GRAPHICS with html2canvas
downloadBtn.addEventListener('click', () => {
     html2canvas(output, {backgroundColor: null,
                        allowTaint: true,
                        useCORS: true,
                        scale: 2}).then((canvas) => {
        const base64img = canvas.toDataURL("image/png");
        const anchor = document.createElement('a');
        anchor.setAttribute("href", base64img);
        anchor.setAttribute("download", `${playerName.innerText}.png`);
        anchor.click();
        anchor.remove();
    }) 



})

//DOWNLOAD GRAPHICS WITH DTI
/* downloadBtn.addEventListener('click', () => {
    domtoimage.toBlob(output)
    .then(function (blob) {
        window.saveAs(blob, 'my-node.png');
    });
}); */