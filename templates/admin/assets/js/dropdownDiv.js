$('.dropDownButton').on("click", function () {
    if($(this).parent().find('.dropDownDiv').hasClass('d-none')){
        $(this).parent().find('.dropDownDiv').removeClass('d-none')
    }else{
        $(this).parent().find('.dropDownDiv').addClass('d-none')
    }
})