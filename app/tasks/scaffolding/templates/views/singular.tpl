{>"layouts/master" /}

{<body}
    <div class="row">
        <div class="small-10 small-offset-1 medium-8 medium-offset-2 columns">
            Title: 
            {@var name="$$names.plural$$.{.id}:title" /}
            <br>
            Slug: 
            {@var name="$$names.plural$$.{.id}:slug" type="text" /}
        </div>
    <div>
{/body}