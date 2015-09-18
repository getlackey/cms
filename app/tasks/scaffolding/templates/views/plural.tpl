{>"layouts/master" /}

{<body}
<div class="row">
   <div class="small-10 small-offset-1 medium-8 medium-offset-2 columns">
        <h1>$$names.plural$$</h1>
        <ul>
            {#items}
            <li><a href="{baseUrl}/$$names.plural$$/{slug}">{title}</a></li>
            {/items}
        </ul>
    </div>
</div>
{/body}