const initialize = function(){
    

    const tournamentTypes = window.api.sendSync('getTournamentTypes-event');
    console.log(tournamentTypes);
    let tournamentTypeSelect = $('#tournamentType_txb');
    console.log(tournamentTypeSelect);
    tournamentTypeSelect.select2({
        placeholder: 'Select pairing system',
        allowClear: true,
        maximumSelectionLength: 1,
        data: tournamentTypes,
    });
}

function join(t, a, s) {
    function format(m) {
       let f = new Intl.DateTimeFormat('en', m);
       return f.format(t);
    }
    return a.map(format).join(s);
 }

const onCreateTournament = function(){
    let newTournament = {};

    let format = [{year: 'numeric'}, {month: '2-digit'}, {day: '2-digit'}];
    let endDate = new Date($('#endDate_txb').val()), startDate = new Date($('#startDate_txb').val()), createdDate = new Date();

    newTournament.PairingSystem = $('#tournamentType_txb').val();
    newTournament.NumberOfRounds = $('#tournamentNumOfRounds_txb').val();
    newTournament.Name = $('#tournamentName_txb').val();
    newTournament.CreatedDate = join(createdDate, format, '-');;
    newTournament.StartDate = join(startDate, format, '-');;
    newTournament.EndDate = join(endDate, format, '-');;
    newTournament.Open = 1;
    newTournament.Closed = 0;
    newTournament.Finished = 0; 
    newTournament.Tempo = $('#tempo_txb').val();
    newTournament.MaxNumberOfPlayers = $('#maxPlayerNumber_txb').val(); 
    newTournament.NumberOfPlayers = 0;

    let isEveryithingFilled = true;
    Object.entries(newTournament).forEach(property => {
        if (property[1] == null)
            isEveryithingFilled = false;
    });

    if (isEveryithingFilled){
        const response = window.api.sendSync("addTournamentToDB-event", newTournament);
        let wrongMsg = $('.wrong_msg');
        if(!response){
            wrongMsg.text('Error occured while adding tournament to DB. Try again or contact support.');
            wrongMsg.css('display', 'block');
        }
    }
    else{
        wrongMsg.text('Please fill all required fields. All fields in this form are required.');
        wrongMsg.css('display', 'block');
    }
}
$( document ).ready(function() {
    initialize();
});
