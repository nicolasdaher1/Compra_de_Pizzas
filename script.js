let modalKey = 0;
let cart = []; //Carrinho de compras
let modalQt = 1;
const c = function(el){
    return document.querySelector(el);
}
const cs = function(el){
    return document.querySelectorAll(el);
}

//Listagem das pizzas
pizzaJson.map(function(pizza, index){                                                               //Mapeia todas as pizzas
    let pizzaItem = c('.models .pizza-item').cloneNode(true);                                       //Permite clonar todos os elementos dentro das classes
    
    pizzaItem.setAttribute('data-key', index);                                                      //Cria data-key com o ID da pizza
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img;                                //Acrescenta a imagem da pizza
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name;                            //Acrescenta o nome da pizza
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;                     //Acrescenta a descrição da pizza
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`;       //Acrescenta o valor da pizza
    
    pizzaItem.querySelector('a').addEventListener('click',function(e){
        e.preventDefault();                                                                         //Previne a ação padrão
        let key = e.target.closest('.pizza-item').getAttribute('data-key');  
        modalQt = 1;                                                                                //Closest retorna o ansestral mais proximo e pega o atributo data-key
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;                                                //Acrescenta a imagem da pizza
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;                                         //Acrescenta o nome da pizza
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;                               //Acrescenta a descrição da pizza
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;           //Acrescenta o preço da pizza
        cs('.pizzaInfo--size').forEach(function(size, sizeIndex){                                   //Função que pega o tamanho das pizzas no array armazenado
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(function(){
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);    
    });
    
    c('.pizza-area').append(pizzaItem);
});

//Eventos do Modal
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(function(){
        c('.pizzaWindowArea').style.display = 'none';
    }, 200);    
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(function(item){
    item.addEventListener('click',closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click',function(){
    if(modalQt > 1){
        modalQt--;
    }
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
c('.pizzaInfo--qtmais').addEventListener('click',function(){
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
cs('.pizzaInfo--size').forEach(function(size,sizeIndex){
    size.addEventListener('click',function(e){
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');          
    })
});
c('.pizzaInfo--addButton').addEventListener('click',function(){
    modalKey;
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    modalQt;

    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex(function(item){                  //Se não encontrar retorna -1
        return item.identifier == identifier;
    })
    
    if(key > -1){
        cart[key].qt += modalQt;
    } else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click',function(){
    if(cart.length > 0){
        c('aside').style.left = '0vw';
    }
});
c('.menu-closer').addEventListener('click',function(){
    c('aside').style.left = '100vw';
});

function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;
    
    if(cart.length > 0){
        c('aside').classList.add('show');   
        c('.cart').innerHTML = '';
        
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        
        for(let i in cart){
            let pizzaItem = pizzaJson.find(function(item){
                return item.id == cart[i].id;
            });
            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = c('.models .cart--item').cloneNode(true);
            
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',function(){
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else{
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',function(){
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }   
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
    } else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
};