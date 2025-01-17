import pandas as pd
import psycopg2
from dotenv import load_dotenv
import os
from pathlib import Path

# Charge les variables d'environnement du backend
env_path = Path(__file__).parents[1] / '.env'
load_dotenv(dotenv_path=env_path)

CATEGORY_MAPPING = {
    'Développeur': 'IT',
    'Chef de projet': 'Project Manager',
    'Data Scientist': 'IT',
    'Ingénieur systèmes': 'IT',
    'Marketing Manager': 'Marketing',
}


def classify_job_title(job_title: str) -> str:
    for keyword, category in CATEGORY_MAPPING.items():
        if keyword.lower() in job_title.lower():
            return category
    return 'Other'


def import_linkedin_profiles():
    try:
        conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        cur = conn.cursor()

        data_dir = Path(__file__).parent / 'data' / 'linkedin_exports'
        csv_files = list(data_dir.glob('*.csv'))
        if not csv_files:
            print("Aucun fichier CSV trouvé")
            return

        latest_csv = max(csv_files, key=lambda x: x.stat().st_mtime)
        df = pd.read_csv(latest_csv)

        for _, row in df.iterrows():
            name = f"{row['First Name']} {row['Last Name']}"
            linkedin_url = row['URL']
            job_title = row['Position']
            company = row['Company']
            category = classify_job_title(job_title)

            cur.execute("""
                INSERT INTO "Profile" (name, linkedin_url, job_title, company, category)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (linkedin_url) DO UPDATE
                SET name = EXCLUDED.name,
                    job_title = EXCLUDED.job_title,
                    company = EXCLUDED.company,
                    category = EXCLUDED.category
            """, (
                name,
                linkedin_url,
                job_title,
                company,
                category
            ))

        conn.commit()
        print(f"Import réussi: {len(df)} profils traités")

    except FileNotFoundError as e:
        print(f"Erreur: Impossible de trouver le fichier CSV - {str(e)}")
    except pd.errors.EmptyDataError:
        print("Erreur: Le fichier CSV est vide")
    except psycopg2.Error as e:
        print(f"Erreur de base de données: {str(e)}")
        if 'conn' in locals():
            conn.rollback()
    except KeyError as e:
        print(f"Erreur: Colonne manquante dans le CSV - {str(e)}")
    except Exception as e:
        print(f"Erreur inattendue: {str(e)}")
    finally:
        if 'conn' in locals():
            conn.close()


if __name__ == "__main__":
    import_linkedin_profiles()
