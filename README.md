# Monolit

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```



## Немножко документации

### Карта

#### Создание карты:
```javascript
window.dataMaps = window.dataMaps || [];
dataMaps.push(options);
```

#### Пресеты иконок
- `monolit#redMarketIcon` - 
- `monolit#grayParkingIcon` - 
- `monolit#greenPlusIcon` - 
- `monolit#orangeToyIcon` - 
- `monolit#darkBlueHomeIcon` - 
- `monolit#lightBlueSportIcon` - 

### Основной цвет
Значения css настраиваются в head двумя способами:
```css
:root {
  --theme-color: #0071d9;
}
```
Или без использования css переменных:
```css
.selected, .navbar-brand__logo, .input-field__input:focus + label, .navbar__header, .facts-block_white, .gallery__control-icon, .gallery__info-icon, .payment-method__icon {
  color: #0071d9;
}

.btn-theme, .btn-theme:hover, .modal .fancybox-close-small, .section_color .section__overlay, .facts-block_color, .tile-list__item::before {
  background-color: #0071d9;
  color: #fff;
}

.btn-theme, .btn-theme:hover, .input-field__input:focus, .gallery__control-icon, .gallery__info-icon {
  border-color: #0071d9;
}
```
Также нужно указать цвет маркера `monolit#default` в настройках карты
