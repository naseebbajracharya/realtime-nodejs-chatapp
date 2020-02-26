$(document).ready(function(){
    $('.add-btn').on('click', function(){
        $('#add-input').click();
    });

    $('#add-input').on('change', function(){
        var addInput = $('#add-input');

        if(addInput.val() != ''){
            var formData = new FormData();

            formData.append('upload', addInput[0].files[0]);

            //After completing, activating span tag
            $('#completed').html(' Photo has been uploaded successfully!');

            $.ajax({
                url: '/userupload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(){
                    addInput.val('');
                }
            })
        }
        DisplayImage(this);
    })

    $('#profile').on('click', function(){
        var username = $('#username').val();
        var fullname = $('#fullname').val();
        var country = $('#country').val();
        var gender = $('#gender').val();
        var cnumber = $('#cnumber').val();
        var twitter = $('#twitter').val();
        var github = $('#github').val();
        var userImage = $('#add-input').val();
        var image = $('#user-image').val();

        var valid = true;
        //when ever user updates profile info but not profile picture
        if(upload === ''){
            $('#add-input').val(image); //add existing profile picture
        }

        //form validations
        if(username === '' || fullname === '' || country === '' || gender === '' || cnumber === ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Please donot leave empty fields!</strong>  All the required fields should be filled up by the user</div>')
        } else {
            userImage = $('#add-input').val();
            $('#error').html('');
        }

        if(valid === true){
            $.ajax({
                url: '/set/profile',
                type: 'POST',
                data: {
                    fullname: fullname,
                    username: username,
                    country: country,
                    gender: gender,
                    cnumber: cnumber,
                    twitter: twitter,
                    github: github,
                    upload: userImage
                },

                success: function(){
                    setTimeout(function(){
                        window.location.reload()
                    }, 200)
                }

            });
        } else {
            return false;
        }
    });
});

function DisplayImage(input){
    if(input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function(e){
            $('#show_img').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}