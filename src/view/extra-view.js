export const POSTSCOUNT = 22;

export const createExtraTemplate = () => (
  `<div class="films-list__container">
  <section class="films-list films-list--extra">
  <h2 class="films-list__title">Top rated</h2>
  <div class="films-list__container">
  </div>
</section>

<section class="films-list films-list--extra">
  <h2 class="films-list__title">Most commented</h2>

  <div class="films-list__container">
  </div>
</section>
</div>`
);

export const createFooterTemplate = () => (
  `<p>${POSTSCOUNT} movies inside</p>`
);
