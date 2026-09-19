import { useEffect, useState } from "react";
import {
    AlertCircle,
    Check,
    ChevronDown,
    Download,
    Loader2,
    Package,
    X,
} from "../../iconesPixelados";
import { cn } from "../../lib/utils";

export interface ItemPlanoInstalacaoConteudo {
    chave: string;
    projectId: string;
    nome: string;
    nomeArquivo: string;
    versao: string;
    tipoVersao: string;
    plataforma: "modrinth" | "curseforge";
    tipoProjeto: "mod" | "resourcepack" | "shader";
    requeridoPor: string[];
    selecionado: boolean;
}

interface ProgressoInstalacao {
    atual: number;
    total: number;
    nome: string;
}

interface RevisaoInstalacaoConteudoProps {
    aberto: boolean;
    plano: ItemPlanoInstalacaoConteudo[];
    carregando: boolean;
    instalando: boolean;
    erro?: string | null;
    progresso?: ProgressoInstalacao | null;
    onFechar: () => void;
    onConfirmar: () => void;
}

const ROTULOS_TIPO: Record<ItemPlanoInstalacaoConteudo["tipoProjeto"], string> = {
    mod: "Mod",
    resourcepack: "Resource pack",
    shader: "Shader",
};

const ROTULOS_VERSAO: Record<string, string> = {
    release: "Estável",
    beta: "Beta",
    alpha: "Alpha",
};

const CLASSES_ROTULO_DETALHE = "text-[9px] font-black uppercase tracking-wider text-white/25";

export default function RevisaoInstalacaoConteudo({
    aberto,
    plano,
    carregando,
    instalando,
    erro,
    progresso,
    onFechar,
    onConfirmar,
}: RevisaoInstalacaoConteudoProps) {
    const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!aberto) setExpandidos(new Set());
    }, [aberto]);

    if (!aberto) return null;

    const selecionados = plano.filter((item) => item.selecionado).length;
    const dependencias = plano.length - selecionados;

    const alternarDetalhes = (chave: string) => {
        setExpandidos((atuais) => {
            const proximos = new Set(atuais);
            if (proximos.has(chave)) {
                proximos.delete(chave);
            } else {
                proximos.add(chave);
            }
            return proximos;
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-revisao-conteudo"
                className={cn(
                    "flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border",
                    "border-white/10 bg-[#121214] shadow-2xl"
                )}
            >
                <header className="flex items-start justify-between gap-4 border-b border-white/8 px-5 py-4">
                    <div>
                        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                            Fila de instalação
                        </p>
                        <h2 id="titulo-revisao-conteudo" className="text-lg font-bold text-white">
                            Revise e confirme
                        </h2>
                        <p className="mt-1 text-xs text-white/45">
                            {selecionados} selecionado{selecionados === 1 ? "" : "s"}
                            {dependencias > 0 && ` + ${dependencias} dependência${dependencias === 1 ? "" : "s"}`}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onFechar}
                        disabled={instalando}
                        aria-label="Fechar revisão"
                        className={cn(
                            "rounded-lg p-2 text-white/40 transition-colors hover:bg-white/8",
                            "hover:text-white disabled:opacity-30"
                        )}
                    >
                        <X size={16} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto p-3 scrollbar-hide">
                    {carregando ? (
                        <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-white/45">
                            <Loader2 size={28} className="animate-spin text-emerald-400" />
                            <p className="text-sm">Conferindo versões e dependências...</p>
                        </div>
                    ) : erro ? (
                        <div className={cn(
                            "m-2 flex min-h-48 flex-col items-center justify-center rounded-xl border px-6",
                            "border-red-400/15 bg-red-400/5 text-center"
                        )}>
                            <AlertCircle size={28} className="mb-3 text-red-300" />
                            <p className="font-bold text-red-200">Não foi possível preparar a instalação</p>
                            <p className="mt-1 max-w-xl text-xs text-red-100/60">{erro}</p>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            {plano.map((item, indice) => {
                                const expandido = expandidos.has(item.chave);
                                return (
                                    <article
                                        key={item.chave}
                                        className={cn(
                                            "overflow-hidden rounded-xl border transition-colors",
                                            item.selecionado
                                                ? "border-white/10 bg-white/[0.035]"
                                                : "border-emerald-400/10 bg-emerald-400/[0.035]"
                                        )}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => alternarDetalhes(item.chave)}
                                            className={cn(
                                                "grid w-full grid-cols-[1.6rem_2.3rem_minmax(0,1fr)_auto]",
                                                "items-center gap-3 px-3 py-3 text-left hover:bg-white/[0.025]"
                                            )}
                                        >
                                            <span className={cn(
                                                "grid h-5 w-5 place-items-center rounded border",
                                                "border-emerald-400/35 bg-emerald-400/15 text-emerald-300"
                                            )}>
                                                <Check size={12} />
                                            </span>
                                            <span className={cn(
                                                "grid h-9 w-9 place-items-center rounded-lg",
                                                "bg-black/25 text-white/35"
                                            )}>
                                                <Package size={16} />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="flex flex-wrap items-center gap-2">
                                                    <span className="truncate text-sm font-bold text-white">
                                                        {item.nome}
                                                    </span>
                                                    {!item.selecionado && (
                                                        <span className={cn(
                                                            "rounded bg-emerald-400/12 px-1.5 py-0.5 text-[9px]",
                                                            "font-black uppercase tracking-wider text-emerald-300"
                                                        )}>
                                                            Dependência
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="mt-0.5 block truncate text-[11px] text-white/35">
                                                    {indice + 1}. {item.nomeArquivo}
                                                </span>
                                            </span>
                                            <ChevronDown
                                                size={15}
                                                className={cn(
                                                    "text-white/30 transition-transform",
                                                    expandido && "rotate-180"
                                                )}
                                            />
                                        </button>

                                        {expandido && (
                                            <dl className={cn(
                                                "grid gap-x-6 gap-y-2 border-t border-white/6 bg-black/10",
                                                "px-4 py-3 text-xs sm:grid-cols-2"
                                            )}>
                                                <div>
                                                    <dt className={CLASSES_ROTULO_DETALHE}>
                                                        Arquivo
                                                    </dt>
                                                    <dd className="mt-0.5 break-all text-white/65">
                                                        {item.nomeArquivo}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className={CLASSES_ROTULO_DETALHE}>
                                                        Provedor
                                                    </dt>
                                                    <dd className="mt-0.5 capitalize text-white/65">
                                                        {item.plataforma}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className={CLASSES_ROTULO_DETALHE}>
                                                        Versão
                                                    </dt>
                                                    <dd className="mt-0.5 text-white/65">{item.versao}</dd>
                                                </div>
                                                <div>
                                                    <dt className={CLASSES_ROTULO_DETALHE}>
                                                        Tipo
                                                    </dt>
                                                    <dd className="mt-0.5 text-white/65">
                                                        {ROTULOS_TIPO[item.tipoProjeto]} ·{" "}
                                                        {ROTULOS_VERSAO[item.tipoVersao] || item.tipoVersao}
                                                    </dd>
                                                </div>
                                                {item.requeridoPor.length > 0 && (
                                                    <div className="sm:col-span-2">
                                                        <dt className={CLASSES_ROTULO_DETALHE}>
                                                            Requerido por
                                                        </dt>
                                                        <dd className="mt-0.5 text-emerald-200/70">
                                                            {item.requeridoPor.join(", ")}
                                                        </dd>
                                                    </div>
                                                )}
                                            </dl>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>

                <footer className="border-t border-white/8 bg-[#0e0e10] px-5 py-4">
                    {progresso && (
                        <div className="mb-3">
                            <div className={cn(
                                "mb-1.5 flex items-center justify-between gap-3",
                                "text-[11px] text-white/45"
                            )}>
                                <span className="truncate">Baixando {progresso.nome}</span>
                                <span>{progresso.atual}/{progresso.total}</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                                <div
                                    className="h-full bg-emerald-400 transition-[width] duration-300"
                                    style={{ width: `${(progresso.atual / progresso.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex items-center justify-between gap-3">
                        <p className="hidden text-[11px] text-white/30 sm:block">
                            A ordem mostrada é a ordem de instalação.
                        </p>
                        <div className="ml-auto flex gap-2">
                            <button
                                type="button"
                                onClick={onFechar}
                                disabled={instalando}
                                className={cn(
                                    "rounded-lg border border-white/10 px-4 py-2 text-xs font-bold",
                                    "text-white/55 hover:bg-white/5 hover:text-white disabled:opacity-30"
                                )}
                            >
                                Voltar
                            </button>
                            <button
                                type="button"
                                onClick={onConfirmar}
                                disabled={carregando || instalando || Boolean(erro) || plano.length === 0}
                                className={cn(
                                    "flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2",
                                    "text-xs font-black text-black transition-colors hover:bg-emerald-300",
                                    "disabled:cursor-not-allowed disabled:opacity-35"
                                )}
                            >
                                {instalando
                                    ? <Loader2 size={14} className="animate-spin" />
                                    : <Download size={14} />}
                                {instalando ? "Instalando..." : "Baixar"}
                            </button>
                        </div>
                    </div>
                </footer>
            </section>
        </div>
    );
}
