(function(a, b) {
    "use strict", a.Storage = function() {
        var a = "chessdemo_",
            b = a + "gameLaunched",
            c = a + "game",
            d = !localStorage.getItem(b);
        localStorage.setItem(b, "true");
        return {
            saveGame: function(a) {
                localStorage.setItem(c, JSON.stringify(a))
            },
            retrieveGame: function() {
                return JSON.parse(localStorage.getItem(c))
            },
            emptyGame: function() {
                localStorage.removeItem(c)
            },
            hasGameSaved: function() {
                return !!localStorage.getItem(c)
            },
            appNeverLaunched: function() {
                return d
            }
        }
    }(), b(document).ready(function() {
        a.Controller.init(), b(window).bind("hashchange", function() {
            a.Controller.route(location.hash ? location.hash.replace("#!", "") : "/")
        }).trigger("hashchange"), b("a").each(function() {
            var a = b(this);
            a.attr("href").substring(0, 4) != "http" && a.bind("touchstart", function() {
                e.preventDefault(), location.hash = b(this).attr("href")
            })
        }), setTimeout(function() {
            b("#pages").addClass("enabletransition")
        }, 500)
    }), a.currentGame = null, a.Controller = function() {
        var c = function(a) {
                var c = b("#" + a);
                c.addClass("current").siblings().removeClass("current")
            },
            d = [],
            e = function(a) {
                d.push(a)
            },
            f = function() {
                for (var a = 0; a < d.length; ++a) d[a]();
                d = []
            };
        return {
            init: function() {},
            route: function(a) {
                f();
                if (a == "/") return this.index();
                if (a == "/menu") return this.menu();
                if (a == "/game/continue") return this.continueGame();
                if (a == "/game/new") return this.newGame();
                if (a == "/game") return this.game();
                if (a = "/help") return this.help()
            },
            index: function() {
                return this.menu()
            },
            menu: function() {
                a.currentGame || a.Storage.hasGameSaved() ? b(".showOnlyIfContinuableGame").show() : b(".showOnlyIfContinuableGame").hide(), c("menu")
            },
            continueGame: function() {
                !a.currentGame && a.Storage.hasGameSaved() && (a.currentGame = new a.Game(a.Storage.retrieveGame()));
                return this.game()
            },
            newGame: function() {
                a.Storage.emptyGame(), a.currentGame = null;
                return this.game()
            },
            game: function() {
                var b = new a.Renderer;
                a.currentGame || (a.currentGame = (new a.Game).init());
                var d = a.currentGame;
                b.init(d), d.bindChange(function() {
                    a.Storage.saveGame(d.export()), d.isFinished() && (alert("CheckMate!"), a.currentGame = null, history.back())
                }), c("game")
            },
            help: function() {
                c("help")
            }
        }
    }();
    var c = function(a) {
            return {
                pub: function(b, c, d, e) {
                    for (e = -1, d = [].concat(a[b]); d[++e];) d[e](c)
                },
                sub: function(b, c) {
                    (a[b] || (a[b] = [])).push(c)
                }
            }
        }({}),
        d = function(a) {
            return function() {
                return ++a
            }
        }(0),
        f = function(a) {
            return _.each("87654321", function(b) {
                _.each("abcdefgh", function(c) {
                    a(c + b, c, b)
                })
            })
        },
        g = function(a) {
            return {
                x: a.charCodeAt(0) - 97,
                y: parseInt(a.substring(1, 2)) - 1
            }
        },
        h = function(a) {
            return String.fromCharCode(a.x + 97) + "" + (a.y + 1)
        };
    a.Renderer = function() {
        var a = this,
            c = ["a2", "a4", "a6", "a8", "c2", "c4", "c6", "c8", "e2", "e4", "e6", "e8", "g2", "g4", "g6", "g8", "b1", "b3", "b5", "b7", "d1", "d3", "d5", "d7", "f1", "f3", "f5", "f7", "h1", "h3", "h5", "h7"];
        a.render = function() {
            if (a.game.isCheckMate(a.game.currentPlayer)) alert("CheckMate");
            else {
                a.board[0].className = "player-" + a.game.currentPlayer;
                var b = a.game.generateCurrentMap();
                f(function(d, e, f) {
                    var g = b[d],
                        h = d;
                    _.include(c, d) && (h += " lighter"), g && (h += " piece " + g.color + " " + g.type, a.game.currentPiece == g && (h += " current")), a.game.possibleMoveContains(d) && (h += " playable"), a.positions[d].className = h
                }), a.blackEated.empty(), _.each(a.game.blackEated, function(b) {
                    a.blackEated.append(createImage({
                        color: "white",
                        type: b
                    }))
                }), a.whiteEated.empty(), _.each(a.game.whiteEated, function(b) {
                    a.whiteEated.append(createImage({
                        color: "black",
                        type: b
                    }))
                })
            }
        }, a.init = function(c) {
            a.game = c, a.board = b("#chessboard").empty(), a.blackEated = b("#black-eated").empty(), a.whiteEated = b("#white-eated").empty(), a.positions = [], f(function(c) {
                var d = b("<div />");
                a.positions[c] = d[0], a.board.append(d), d.bind("click", function() {
                    a.game.onClick(c)
                })
            }), a.render(), a.game.bindChange(function() {
                a.render()
            });
            return this
        }
    }, a.Piece = function(a) {
        var b = this;
        b.color = a.color, b.type = a.type, b.position = a.position
    }, a.Game = function(b) {
        var e = this;
        e.pieces = [], e.whiteEated = [], e.blackEated = [], e.currentPlayer = "white", e.currentPiece = null, e.possibleMoves = null;
        var f = d();
        e.import = function(a) {
            e.pieces = _.clone(a.pieces), e.whiteEated = _.clone(a.whiteEated), e.blackEated = _.clone(a.blackEated), e.currentPlayer = a.currentPlayer
        }, b && e.import(b), e.export = function() {
            return {
                pieces: _.clone(e.pieces),
                whiteEated: _.clone(e.whiteEated),
                blackEated: _.clone(e.blackEated),
                currentPlayer: e.currentPlayer
            }
        }, e.init = function() {
            var b = function(b, c, d) {
                return new a.Piece({
                    color: b,
                    type: c,
                    position: d
                })
            };
            e.pieces = [], e.currentPlayer = "white", e.currentPiece = null;
            var c = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
            for (var d = 0; d <= 7; ++d) {
                var f = String.fromCharCode(d + 97);
                e.pieces.push(b("white", c[d], f + "1")), e.pieces.push(b("white", "pawn", f + "2")), e.pieces.push(b("black", "pawn", f + "7")), e.pieces.push(b("black", c[d], f + "8"))
            }
            return this
        }, e.toggleCurrentPlayer = function() {
            e.currentPlayer = e.currentPlayer == "white" ? "black" : "white"
        }, e.triggerChange = function() {
            c.pub("game" + f + "_change")
        }, e.bindChange = function(a) {
            c.sub("game" + f + "_change", a)
        }, e.onGameEnd = function(a) {
            c.sub("game" + f + "_end", a)
        }, e.askPiece = function(a) {
            a("queen")
        }, e.onClick = function(a) {
            var b = function() {
                    e.unselect(), e.triggerChange()
                },
                c = function(a) {
                    e.select(a), e.triggerChange()
                },
                d = function() {
                    b(), e.toggleCurrentPlayer(), e.triggerChange()
                },
                f = e.findPieceByPosition(a),
                g = f && f.color == e.currentPlayer,
                h = f && f.color != e.currentPlayer;
            e.currentPiece ? g ? f == e.currentPiece ? b() : c(f) : h ? e.canTakeWithSelected(f) ? (e.takeWithSelected(f), d()) : b() : e.canMoveSelected(a) ? (e.moveSelected(a), d()) : b() : g && c(f)
        }, e.select = function(a) {
            e.currentPiece = a, e.isCheck(a.color) && a.type != "king" ? e.possibleMoves = [] : e.possibleMoves = e.getMoves(a)
        }, e.unselect = function() {
            e.currentPiece = null, e.possibleMoves = null
        }, e.possibleMoveContains = function(a) {
            return _.include(e.possibleMoves, a)
        }, e.canMoveSelected = function(a) {
            return !e.findPieceByPosition(a) && e.possibleMoveContains(a)
        }, e.moveSelected = function(a) {
            if (e.currentPiece.type == "king") {
                var b = e.currentPiece.color == "white" ? 0 : 7,
                    c = g(e.currentPiece.position),
                    d = g(a);
                c.x == 4 && c.y == b && d.y == b && d.x == 6 && (e.findPieceByPosition(h({
                    x: 7,
                    y: b
                })).position = h({
                    x: 5,
                    y: b
                }))
            }
            e.currentPiece.position = a
        }, e.canTakeWithSelected = function(a) {
            return e.possibleMoveContains(a.position)
        }, e.takeWithSelected = function(a) {
            e.currentPiece.position = a.position, e.pieces = _.without(e.pieces, a), a.color == "black" ? e.whiteEated.push(a.type) : e.blackEated.push(a.type)
        }, e.isCheck = function(a) {
            var b = e.findKing(a),
                c = e.generateCurrentMap(),
                d = a == "white" ? "black" : "white",
                f = _.filter(e.pieces, function(a) {
                    return a.color == d
                });
            return _.any(f, function(a) {
                var b = e.getVisibles(a, c);
                return _.include(b, function(b) {
                    return b.position.x == a.position.x && b.position.y == a.position.y
                })
            })
        }, e.isCheckMate = function(a) {
            var b = e.findKing(a),
                c = e.getMoves(b);
            return !1
        }, e.isFinished = function() {
            return e.isCheckMate("white") || e.isCheckMate("black")
        }, e.findKing = function(a) {
            return _.detect(e.pieces, function(b) {
                return b.type == "king" && b.color == a
            })
        }, e.findPieceByPosition = function(a) {
            return _.detect(e.pieces, function(b) {
                return b.position == a
            })
        }, e.generateCurrentMap = function() {
            var a = {};
            _.each(e.pieces, function(b) {
                a[b.position] = b
            });
            return a
        }, e.getVisibles = function(a, b) {
            b || (b = e.generateCurrentMap());
            var c = [],
                d = g(a.position),
                f = !1,
                i = function(d) {
                    if (!f) {
                        var e = b[d];
                        e ? (e.color != a.color && c.push(d), f = !0) : c.push(d)
                    }
                };
            if (a.type == "rook" || a.type == "queen") d.x < 7 && (f = !1, _(_.range(d.x + 1, 9)).chain().map(function(a) {
                return h({
                    x: a,
                    y: d.y
                })
            }).each(i)), d.x > 0 && (f = !1, _(_.range(d.x - 1, -1, -1)).chain().map(function(a) {
                return h({
                    x: a,
                    y: d.y
                })
            }).each(i)), d.y < 7 && (f = !1, _(_.range(d.y + 1, 9)).chain().map(function(a) {
                return h({
                    x: d.x,
                    y: a
                })
            }).each(i)), d.y > 0 && (f = !1, _(_.range(d.y - 1, -1, -1)).chain().map(function(a) {
                return h({
                    x: d.x,
                    y: a
                })
            }).each(i));
            if (a.type == "bishop" || a.type == "queen") d.x < 7 && d.y < 7 && (f = !1, _(_.range(1, 8 - Math.max(d.x, d.y))).chain().map(function(a) {
                return h({
                    x: d.x + a,
                    y: d.y + a
                })
            }).each(i)), d.x > 0 && d.y < 7 && (f = !1, _(_.range(1, Math.max(d.x - 1, 8 - d.y))).chain().map(function(a) {
                return h({
                    x: d.x - a,
                    y: d.y + a
                })
            }).each(i)), d.x < 7 && d.y > 0 && (f = !1, _(_.range(1, Math.max(8 - d.x, d.y - 1))).chain().map(function(a) {
                return h({
                    x: d.x + a,
                    y: d.y - a
                })
            }).each(i)), d.x > 0 && d.y > 0 && (f = !1, _(_.range(1, Math.max(d.x, d.y) - 1)).chain().map(function(a) {
                return h({
                    x: d.x - a,
                    y: d.y - a
                })
            }).each(i));
            if (a.type == "knight") {
                var j = [{
                    x: 1,
                    y: 2
                }, {
                    x: 1,
                    y: -2
                }, {
                    x: -1,
                    y: 2
                }, {
                    x: -1,
                    y: -2
                }, {
                    y: 1,
                    x: 2
                }, {
                    y: 1,
                    x: -2
                }, {
                    y: -1,
                    x: 2
                }, {
                    y: -1,
                    x: -2
                }];
                for (var k in j) {
                    var l = j[k],
                        m = _.clone(d);
                    m.y += l.y, m.x += l.x;
                    var n = h(m),
                        o = b[n];
                    (!o || o.color != a.color) && c.push(n)
                }
            }
            if (a.type == "king") {
                for (var p = d.x - 1; p <= d.x + 1; ++p)
                    for (var q = d.y - 1; q <= d.y + 1; ++q) {
                        var n = h({
                                x: p,
                                y: q
                            }),
                            o = b[n];
                        (!o || o && o.color != a.color) && c.push(n)
                    }
                var q = a.color == "white" ? 0 : 7;
                if (d.x == 4 && d.y == q && !b[h({
                        x: 5,
                        y: q
                    })] && !b[h({
                        x: 6,
                        y: q
                    })]) {
                    var m = b[h({
                        x: 7,
                        y: q
                    })];
                    m && m.type == "rook" && m.color == a.color && c.push(h({
                        x: 6,
                        y: q
                    }))
                }
            }
            if (a.type == "pawn") {
                var r = a.color == "white" ? 1 : -1,
                    m = _.clone(d);
                m.y += r;
                var n = h(m),
                    o = b[n];
                o || (c.push(n), m.y += r, n = h(m), o = b[n], !o && (a.color == "white" && d.y == 1 || a.color == "black" && d.y == 6) && c.push(n), m.y -= r), m.x += 1, n = h(m), o = b[n], o && o.color != a.color && c.push(n), m.x -= 2, n = h(m), o = b[n], o && o.color != a.color && c.push(n)
            }
            c = _.reject(c, function(a) {
                var b = g(a);
                return b.x < 0 || b.x >= 8 || b.y < 0 || b.y >= 8
            });
            return c
        }, e.getMoves = function(a, b) {
            b || (b = e.generateCurrentMap());
            return _.reject(e.getVisibles(a, b), function(a) {
                var c = b[a];
                return c && c.type == "king"
            })
        }
    }
})(window.Game = {}, window.jQuery || window.Zepto);
