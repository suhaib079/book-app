'use strict';

$('.topnav').on('click', ()=>{
    $('.toggle').toggle()
})

$('#searchNav').on('click', ()=>{
    $('.form').toggle()
    $('#topForm').toggle()
    $('.toggle').toggle()
})
$('#updateForm').hide()
$('#updateBtn').on('click', () => {
    $('#updateForm').toggle();
    $('.card').toggle()
    $('#deleteBtn').toggle();
})
$('#closeBtn').on('click', () => {
    $('.card').toggle()
    $('#deleteBtn').toggle();
    $('#updateForm').toggle();
})