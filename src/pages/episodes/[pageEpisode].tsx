import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from "./episode.module.scss";
import Image from "next/image";
import Head from "next/head";
import { usePlayer } from "../../contexts/PlayerContext";

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    durationAsString: string;
    description: string;
    url: string;
    publishedAt: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
    const { play } = usePlayer();

    return (
        <div className={styles.pageEpisode}>
            <Head>
                <title>{episode.title}r</title>
            </Head>

            <div className={styles.episode}>
                <div className={styles.thumbnailContainer}>
                    <Link href="/">
                        <button type="button">
                            <img src="/arrow-left.svg" alt="Voltar" />
                        </button>
                    </Link>
                    <Image
                        width={700}
                        height={160}
                        src={episode.thumbnail}
                        objectFit={"cover"}
                    />
                    <button type='button' onClick={() => play(episode)}>
                        <img src="/play.svg" alt="Tocar episódio" />
                    </button>
                </div>

                <header>
                    <h1>{episode.title}</h1>
                    <span>{episode.members}</span>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                </header>

                <div
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: episode.description }}
                />
            </div>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async context => {
    const { pageEpisode } = context.params;
    const { data } = await api.get(`/episodes/${pageEpisode}`);

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        thumbnail: data.thumbnail,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
            locale: ptBR
        }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    }

    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24 // 24horas
    }
}