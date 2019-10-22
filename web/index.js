$( document ).ready(function() {
    console.log( "document ready!" );

    $.get( "/videos", function( video_names_list ) {
        for(index in video_names_list){
            var video_id = video_names_list[index]
            var video_name = video_id.split('_')[1].replace(/-/g, ' ')
            $("#videosList").append( '<li class="list-group-item" style="text-transform: capitalize"><a href="dash-player?video_id=' + video_id + '">' + video_name + '</a></li>' );
        }
    });
});