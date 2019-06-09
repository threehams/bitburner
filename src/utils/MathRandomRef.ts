/**
 * This is a reference to the native Math.random() function.
 * Math.random() is used in various places around the game's source code.
 * This reference is used to make sure that if players alter Math.random()
 * through NetscriptJS, then the game will still function properly
 */
export const MathRandomRef = Math.random.bind(Math);
