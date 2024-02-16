let well_formed_length = 150;

let portable_text_containers = document.getElementsByClassName('portable_text_container');
for (let i = 0; i < portable_text_containers.length; i++) {
    if (portable_text_containers[i].getAttribute('rendered') === 'true') {
        continue;
    }
    let target = portable_text_containers[i].getElementsByClassName('portable_text')[0];
    let existing_html = target.innerHTML;
    let figures_raw_html = portable_text_containers[i].getElementsByClassName('input_figures')[0].innerHTML;
    let figures = figures_raw_html.split('<figure>').map(figure => `<figure>${figure}`).slice(1);
    // Remove closing tags p tags
    let without_closing_tags = existing_html.replace(/<\/p>/g, '');
    let paragraphs = without_closing_tags.split('<p>').map(p => p.trim());

    let well_formed_paragraph_indices = [];
    for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].length >= well_formed_length) {
            well_formed_paragraph_indices.push(i);
        }
    }

    let paragraph_groups = [];
    for (let i = 0; i < well_formed_paragraph_indices.length; i++) {
        if (i === 0) {
            // Add all integers from 0 to the first well formed paragraph index
            paragraph_groups.push(Array.from({ length: well_formed_paragraph_indices[i] }, (_, i) => i));
        }
        else {
            // Add all integers from the last well formed paragraph index to the next well formed paragraph index
            paragraph_groups.push(Array.from({ length: well_formed_paragraph_indices[i] - well_formed_paragraph_indices[i - 1] }, (_, j) => j + well_formed_paragraph_indices[i - 1]));
        }
    }

    let num_figure_spaces = paragraph_groups.length;
    let num_figures = figures.length;
    let figures_per_space = num_figures / num_figure_spaces;
    let spaces_per_figure = num_figure_spaces / num_figures;
    let figure_indices_by_space = [];
    let space_by_figure = [];

    for (let i = 0; i < num_figures; i++) {
        let position = Math.round(i * spaces_per_figure);
        let space = Math.min(position, num_figure_spaces - 1);
        space_by_figure.push(space);
    }

    for (let i = 0; i < num_figure_spaces; i++) {
        let figures_for_space = [];
        for (let j = 0; j < space_by_figure.length; j++) {
            if (space_by_figure[j] === i) {
                figures_for_space.push(j);
            }
        }
        figure_indices_by_space.push(figures_for_space);
    }

    // Get index of first non-empty array in figure_indices_by_space
    let num_leading_blank_spaces = figure_indices_by_space.findIndex(space => space.length > 0);
    // Get index of last non-empty array in figure_indices_by_space
    let num_trailing_blank_spaces = figure_indices_by_space.reverse().findIndex(space => space.length > 0);

    // While there are more than more than one trailing blank spaces than leading blank spaces
    let num_shifts = 0;
    while (num_trailing_blank_spaces > num_leading_blank_spaces + 1) {
        // Move last element of figure_indices_by_space to the beginning of the array
        figure_indices_by_space.unshift(figure_indices_by_space.pop());
        num_shifts++;
        num_trailing_blank_spaces--;
        num_leading_blank_spaces++;
    }

    for (let i = 0; i < space_by_figure.length; i++) {
        space_by_figure[i] += num_shifts;
    }

    let new_inner_html = '';
    for (let paragraph_group_index = 0; paragraph_group_index < paragraph_groups.length; paragraph_group_index++) {
        let paragraph_indices = paragraph_groups[paragraph_group_index];
        let paragraph_group = paragraph_indices.map(index => paragraphs[index]);
        let figure_group_indices = figure_indices_by_space[paragraph_group_index];
        let figure_group_html = figure_group_indices.map(index => figures[index]).join('');
        let paragraph_group_html = paragraph_group.map(paragraph => `<p>${paragraph}</p>`).join('');
        new_inner_html += paragraph_group_html + figure_group_html;
    }

    target.innerHTML = new_inner_html;
    target.setAttribute('rendered', 'true');
}



// const target = document.getElementsByClassName('article')[0];

// const existing_html = `<p>
// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin varius purus eu risus hendrerit accumsan. Vivamus lobortis tempus elit in condimentum. Nunc sit amet aliquam purus. Nulla placerat arcu neque, quis iaculis justo commodo ut. Donec commodo libero risus, non tempus arcu malesuada ut. Duis eu tellus eget mauris scelerisque mollis id hendrerit felis. Aliquam porta, eros vitae tincidunt ullamcorper, ligula ex elementum sapien, eu venenatis eros ligula nec mauris. Duis pharetra nunc sit amet aliquam fermentum. Fusce quam enim, dignissim ut libero sit amet, feugiat venenatis odio. Sed justo nisl, aliquam eget mattis ut, convallis id nulla. Etiam egestas dolor nunc, ac molestie ipsum eleifend sed. Nulla fermentum at lacus nec congue. Quisque eget tempor nulla, nec venenatis arcu. Aliquam vitae augue nisi. Morbi laoreet, ipsum vel accumsan suscipit, neque turpis efficitur sem, et egestas sapien sapien quis augue. Vivamus vestibulum sem odio, ac vestibulum turpis tincidunt non.
// </p>
// <p></p>
// <p>
// Pellentesque viverra tincidunt libero nec egestas. Aliquam erat volutpat. Nunc suscipit interdum placerat. Aliquam sodales, ex vehicula sollicitudin posuere, quam est semper sem, non egestas dolor velit sit amet felis. Donec iaculis euismod sapien vel maximus. Vivamus tempor est quis leo bibendum, at sagittis orci consequat. Ut blandit purus eget dictum posuere. Vivamus pellentesque non quam at tincidunt. Proin vitae laoreet lorem. Aliquam cursus, turpis quis placerat porta, velit lectus porttitor leo, a lobortis tellus ex et augue. Cras eget urna nec nunc lacinia consequat. Pellentesque dolor lorem, lacinia eu porta ac, finibus vitae est. Sed finibus risus eget lobortis elementum. Morbi mi augue, mollis ac dolor nec, rutrum elementum magna. Praesent molestie ligula non faucibus sodales.
// </p>
// <p></p>
// <p>
// Vivamus eu magna nunc. Nam dictum posuere ligula, at imperdiet sapien. Curabitur pellentesque dui quis auctor bibendum. Mauris cursus bibendum sapien, ut laoreet justo tristique nec. Mauris faucibus dolor quis bibendum pulvinar. Aenean ex quam, malesuada eget fermentum non, consectetur eu magna. Donec facilisis sollicitudin eros, eu commodo nisi euismod quis. Duis dignissim maximus sagittis. Vivamus arcu diam, suscipit at leo eu, feugiat condimentum enim. Sed leo sapien, fringilla vel nisi ut, semper posuere quam. Nunc sed purus elit. Proin in odio vel felis suscipit porttitor eget ac nibh. Etiam malesuada, nisl lacinia tristique viverra, odio nisi blandit nulla, sit amet dignissim massa augue et neque. Nam non magna ligula. Sed aliquam lorem sed turpis tempus venenatis. In pretium tristique nunc, ut pharetra magna dictum in.
// </p>
// <p></p>
// <p>
// Etiam efficitur et eros ac malesuada. Cras maximus luctus pharetra. Sed sit amet mi vitae ante sollicitudin bibendum accumsan in sem. Quisque bibendum nulla ac mauris facilisis blandit. Fusce consequat nec diam eu eleifend. Cras lobortis mollis nisi nec sodales. Sed rutrum mi sed est mattis, eget sollicitudin sem dictum. Proin vel nisl ut diam ullamcorper ornare. Pellentesque maximus metus id ex cursus, nec interdum eros semper.
// </p>
// <p></p>
// <p>
// In posuere dui eu efficitur gravida. Pellentesque efficitur blandit mauris, hendrerit mattis mi dapibus nec. Sed pellentesque velit dolor, non tristique ipsum vestibulum id. Cras tincidunt interdum ligula quis ornare. Quisque a ipsum volutpat, accumsan mauris ac, mattis erat. Etiam scelerisque in risus vitae blandit. Cras sagittis lobortis urna, imperdiet scelerisque sapien tempus ac.
// </p>
// <p></p>
// <p>
// Vestibulum vitae nisl eu lorem suscipit vehicula. Quisque lacinia imperdiet velit, non convallis metus scelerisque id. Aliquam erat volutpat. Aenean condimentum dolor nulla, et ornare leo dapibus vel. Morbi ultricies quis ipsum id placerat. Aliquam sit amet dictum sem. Donec vehicula mauris risus, vel interdum mi commodo ut. Phasellus iaculis turpis nunc, a pulvinar est faucibus sit amet. Sed ac laoreet massa, nec tincidunt mi. Suspendisse lobortis condimentum consequat. Praesent venenatis leo nec purus eleifend pharetra.
// </p>
// <p></p>
// <p>
// Sed vehicula id metus et pharetra. Aliquam consequat dui risus. Curabitur bibendum semper libero ut cursus. Curabitur a fringilla mi, ac laoreet massa. Aliquam venenatis mi quis tellus aliquam aliquam. Pellentesque leo risus, dictum sit amet nisl et, placerat pulvinar risus. Vestibulum condimentum metus sed mi iaculis semper. Vivamus eu tristique nisl. Sed id elit ante. Nunc eget commodo dolor. Suspendisse dignissim turpis sed accumsan sagittis. Phasellus volutpat odio metus, nec mattis sem mattis non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin faucibus enim nec maximus dignissim.
// </p>
// <p></p>
// <p>
// Maecenas mattis dui nec neque iaculis auctor. Donec eget tellus quis neque pulvinar mollis id quis neque. Aliquam at cursus arcu. Proin imperdiet ante odio, in convallis tellus suscipit sit amet. Etiam pellentesque, magna in eleifend tincidunt, mauris libero maximus sem, id luctus magna orci nec tortor. Suspendisse bibendum eros fringilla ligula tincidunt condimentum. Vestibulum mauris mauris, vulputate mattis ante sit amet, interdum tempor mauris. Nam elementum ante vel velit porttitor, non pharetra lorem rhoncus. Aenean consectetur tincidunt tortor bibendum aliquet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sodales vestibulum mi.
// </p>
// <p></p>
// <p>
// Sed viverra augue at posuere sollicitudin. Sed auctor justo ac nisi facilisis interdum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed et mi interdum, tincidunt velit quis, congue lorem. Quisque quis risus vehicula, dignissim nisi sed, lobortis ex. Cras convallis vitae ipsum eget dictum. In venenatis augue mi, a tempus odio blandit tincidunt. Quisque lobortis faucibus orci, vestibulum vestibulum ante porttitor eu. Duis lectus tortor, consequat tincidunt ex ut, fermentum venenatis elit. Sed pharetra nibh quis nunc viverra scelerisque. Pellentesque in ligula non nisi consequat eleifend quis at arcu. Ut eget mollis felis. Duis at magna bibendum, mattis lorem ac, suscipit elit. Maecenas tempus ut velit a congue.
// </p>
// <p></p>
// <p>
// Cras iaculis aliquam enim, eu scelerisque odio gravida fringilla. Morbi placerat dictum nisl, eget mollis felis maximus eget. Donec sit amet malesuada nulla. Maecenas fermentum facilisis elit, nec scelerisque arcu condimentum id. Praesent eu imperdiet mi. Aliquam volutpat turpis quis nulla pharetra, non laoreet felis ultricies. Curabitur ut molestie ante, a interdum erat. Nullam malesuada viverra ligula, non hendrerit arcu venenatis sit amet. Vestibulum placerat risus vitae quam pellentesque, ac dignissim nisl commodo. Phasellus accumsan egestas semper. Proin lacinia, orci in malesuada gravida, nisi mauris lobortis massa, et aliquam nunc ante eu lectus. Quisque molestie et erat et gravida. Etiam gravida eleifend nunc. Quisque non ullamcorper libero. Praesent a sapien sit amet ipsum molestie tempor.
// </p>`

// let figures = [
//     `<div><figure class="styles_project_figure___HRR8 styles_shadow__RqE3u"><img alt="" loading="lazy" class="styles_project_image__0uW8s" srcset="https://cdn.sanity.io/images/mfxt9eaf/production/fce5fbc7515abb144b3cdfa762bd75beaf10a69f-2928x1638.png?auto=format&amp;fit=max&amp;q=75&amp;w=366 366w, https://cdn.sanity.io/images/mfxt9eaf/production/fce5fbc7515abb144b3cdfa762bd75beaf10a69f-2928x1638.png?auto=format&amp;fit=max&amp;q=75&amp;w=732 732w, https://cdn.sanity.io/images/mfxt9eaf/production/fce5fbc7515abb144b3cdfa762bd75beaf10a69f-2928x1638.png?auto=format&amp;fit=max&amp;q=75&amp;w=1098 1098w, https://cdn.sanity.io/images/mfxt9eaf/production/fce5fbc7515abb144b3cdfa762bd75beaf10a69f-2928x1638.png?auto=format&amp;fit=max&amp;q=75&amp;w=1464 1464w, https://cdn.sanity.io/images/mfxt9eaf/production/fce5fbc7515abb144b3cdfa762bd75beaf10a69f-2928x1638.png?auto=format&amp;fit=max&amp;q=75&amp;w=1830 1830w, https://cdn.sanity.io/images/mfxt9eaf/production/fce5fbc7515abb144b3cdfa762bd75beaf10a69f-2928x1638.png?auto=format&amp;fit=max&amp;q=75&amp;w=2196 2196w, https://cdn.sanity.io/images/mfxt9eaf/production/fce5fbc7515abb144b3cdfa762bd75beaf10a69f-2928x1638.png?auto=format&amp;fit=max&amp;q=75&amp;w=2562 2562w, https://cdn.sanity.io/images/mfxt9eaf/production/fce5fbc7515abb144b3cdfa762bd75beaf10a69f-2928x1638.png?auto=format&amp;fit=max&amp;q=75&amp;w=2928 2928w" src="https://cdn.sanity.io/images/mfxt9eaf/production/fce5fbc7515abb144b3cdfa762bd75beaf10a69f-2928x1638.png?auto=format&amp;fit=max&amp;q=75&amp;w=1464" width="1464" height="819"><figcaption class="styles_project_figure_caption__QOPq1">Map View</figcaption></figure>`,

//     `</div><div><figure class="styles_project_figure___HRR8 styles_shadow__RqE3u"><img alt="" loading="lazy" class="styles_project_image__0uW8s" srcset="https://cdn.sanity.io/images/mfxt9eaf/production/0d9d31c1f21bececc937e00ac45a4b88e1133279-2934x1644.png?auto=format&amp;fit=max&amp;q=75&amp;w=367 367w, https://cdn.sanity.io/images/mfxt9eaf/production/0d9d31c1f21bececc937e00ac45a4b88e1133279-2934x1644.png?auto=format&amp;fit=max&amp;q=75&amp;w=734 734w, https://cdn.sanity.io/images/mfxt9eaf/production/0d9d31c1f21bececc937e00ac45a4b88e1133279-2934x1644.png?auto=format&amp;fit=max&amp;q=75&amp;w=1100 1100w, https://cdn.sanity.io/images/mfxt9eaf/production/0d9d31c1f21bececc937e00ac45a4b88e1133279-2934x1644.png?auto=format&amp;fit=max&amp;q=75&amp;w=1467 1467w, https://cdn.sanity.io/images/mfxt9eaf/production/0d9d31c1f21bececc937e00ac45a4b88e1133279-2934x1644.png?auto=format&amp;fit=max&amp;q=75&amp;w=1834 1834w, https://cdn.sanity.io/images/mfxt9eaf/production/0d9d31c1f21bececc937e00ac45a4b88e1133279-2934x1644.png?auto=format&amp;fit=max&amp;q=75&amp;w=2201 2201w, https://cdn.sanity.io/images/mfxt9eaf/production/0d9d31c1f21bececc937e00ac45a4b88e1133279-2934x1644.png?auto=format&amp;fit=max&amp;q=75&amp;w=2567 2567w, https://cdn.sanity.io/images/mfxt9eaf/production/0d9d31c1f21bececc937e00ac45a4b88e1133279-2934x1644.png?auto=format&amp;fit=max&amp;q=75&amp;w=2934 2934w" src="https://cdn.sanity.io/images/mfxt9eaf/production/0d9d31c1f21bececc937e00ac45a4b88e1133279-2934x1644.png?auto=format&amp;fit=max&amp;q=75&amp;w=1467" width="1467" height="822"><figcaption class="styles_project_figure_caption__QOPq1">Advanced Searching</figcaption></figure>`
// ]

// // Remove closing tags p tags
// let without_closing_tags = existing_html.replace(/<\/p>/g, '');
// let paragraphs = without_closing_tags.split('<p>').map(p => p.trim());

// let well_formed_paragraph_indices = [];
// for (let i = 0; i < paragraphs.length; i++) {
//     if (paragraphs[i].length >= well_formed_length) {
//         well_formed_paragraph_indices.push(i);
//     }
// }

// let paragraph_groups = [];
// for (let i = 0; i < well_formed_paragraph_indices.length; i++) {
//     if (i === 0) {
//         // Add all integers from 0 to the first well formed paragraph index
//         paragraph_groups.push(Array.from({ length: well_formed_paragraph_indices[i] }, (_, i) => i));
//     }
//     else {
//         // Add all integers from the last well formed paragraph index to the next well formed paragraph index
//         paragraph_groups.push(Array.from({ length: well_formed_paragraph_indices[i] - well_formed_paragraph_indices[i - 1] }, (_, j) => j + well_formed_paragraph_indices[i - 1]));
//     }
// }

// let num_figure_spaces = paragraph_groups.length;
// let num_figures = figures.length;
// let figures_per_space = num_figures / num_figure_spaces;
// let spaces_per_figure = num_figure_spaces / num_figures;
// let figure_indices_by_space = [];
// let space_by_figure = [];

// for (let i = 0; i < num_figures; i++) {
//     let position = Math.round(i * spaces_per_figure);
//     let space = Math.min(position, num_figure_spaces - 1);
//     space_by_figure.push(space);
// }

// for (let i = 0; i < num_figure_spaces; i++) {
//     let figures_for_space = [];
//     for (let j = 0; j < space_by_figure.length; j++) {
//         if (space_by_figure[j] === i) {
//             figures_for_space.push(j);
//         }
//     }
//     figure_indices_by_space.push(figures_for_space);
// }

// // Get index of first non-empty array in figure_indices_by_space
// let num_leading_blank_spaces = figure_indices_by_space.findIndex(space => space.length > 0);
// // Get index of last non-empty array in figure_indices_by_space
// let num_trailing_blank_spaces = figure_indices_by_space.reverse().findIndex(space => space.length > 0);

// // While there are more than more than one trailing blank spaces than leading blank spaces
// let num_shifts = 0;
// while (num_trailing_blank_spaces > num_leading_blank_spaces + 1) {
//     // Move last element of figure_indices_by_space to the beginning of the array
//     figure_indices_by_space.unshift(figure_indices_by_space.pop());
//     num_shifts++;
//     num_trailing_blank_spaces--;
//     num_leading_blank_spaces++;
// }

// for (let i = 0; i < space_by_figure.length; i++) {
//     space_by_figure[i] += num_shifts;
// }

// let new_inner_html = '';
// for (let paragraph_group_index = 0; paragraph_group_index < paragraph_groups.length; paragraph_group_index++) {
//     let paragraph_indices = paragraph_groups[paragraph_group_index];
//     let paragraph_group = paragraph_indices.map(index => paragraphs[index]);
//     let figure_group_indices = figure_indices_by_space[paragraph_group_index];
//     let figure_group_html = figure_group_indices.map(index => figures[index]).join('');
//     let paragraph_group_html = paragraph_group.map(paragraph => `<p>${paragraph}</p>`).join('');
//     new_inner_html += paragraph_group_html + figure_group_html;
// }

// target.innerHTML = new_inner_html;