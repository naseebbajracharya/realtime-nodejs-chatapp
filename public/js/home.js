$(document).ready(function(){
    $('#favourite').on('submit', function(e){
        e.preventDefault();

        var id = $('#id').val();
        var groupName = $('#group_Name').val();
    
        $.ajax({
            url: '/home',
            type: 'POST',
            data: {
                id: id,
                groupName: groupName
            },
            success: function(){
                console.log(groupName)
            }
        })
    })
});