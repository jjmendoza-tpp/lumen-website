#!/usr/bin/env python3
"""Añade el trigger `consent_update` a los Custom HTML hard-gateados del
container GTM-KZNM7JNM (LinkedIn — Insight Base, HubSpot — Tracking).

Por qué: esos tags disparan solo en "All Pages" y GTM no re-evalúa tags
consent-blocked cuando llega un consent update a mitad de visita. Sin este
trigger, en la visita en la que el usuario acepta el banner (Consent Mode v2,
PR #18) LinkedIn y HubSpot no cargan hasta el siguiente page view. El sitio
ya empuja `dataLayer.push({event: 'consent_update', ...})` al decidir
(components/CookieBanner.tsx), pensado exactamente como trigger de GTM.

El cambio es inerte mientras producción no empuje `consent_update` (es decir,
hasta que se deployee PR #18) y reversible vía versiones de GTM.

Uso (mismo patrón que prometheus-website/tools/gtm_consent_advanced.py):

  GOOGLE_APPLICATION_CREDENTIALS=../prometheus-website/.gtm-sa-key.json \
    python3 tools/gtm_consent_update_trigger.py                      # dry-run
  ... gtm_consent_update_trigger.py --apply                          # workspace
  ... gtm_consent_update_trigger.py --apply --publish                # + publica

Requiere: pip install google-api-python-client google-auth
"""

import os
import sys

from google.oauth2 import service_account
from googleapiclient.discovery import build

CONTAINER = "accounts/6350453098/containers/249738349"  # GTM-KZNM7JNM
TRIGGER_NAME = "T - consent_update"
TARGET_TAGS = ("LinkedIn — Insight Base", "HubSpot — Tracking")


def main() -> None:
    apply_ = "--apply" in sys.argv
    publish = "--publish" in sys.argv

    key_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", ".gtm-sa-key.json")
    scopes = [
        "https://www.googleapis.com/auth/tagmanager.edit.containers",
        "https://www.googleapis.com/auth/tagmanager.edit.containerversions",
    ]
    if publish:
        scopes.append("https://www.googleapis.com/auth/tagmanager.publish")
    creds = service_account.Credentials.from_service_account_file(key_path, scopes=scopes)
    svc = build("tagmanager", "v2", credentials=creds)
    ws_api = svc.accounts().containers().workspaces()

    w = ws_api.list(parent=CONTAINER).execute()["workspace"][0]
    print(f"Workspace: {w['name']} ({w['path']})")

    triggers = ws_api.triggers().list(parent=w["path"]).execute().get("trigger", [])
    existing = next((t for t in triggers if t["name"] == TRIGGER_NAME), None)
    if existing:
        trig_id = existing["triggerId"]
        print(f"Trigger ya existe: {trig_id}")
    elif apply_:
        created = ws_api.triggers().create(
            parent=w["path"],
            body={
                "name": TRIGGER_NAME,
                "type": "customEvent",
                "customEventFilter": [
                    {
                        "type": "equals",
                        "parameter": [
                            {"type": "template", "key": "arg0", "value": "{{_event}}"},
                            {"type": "template", "key": "arg1", "value": "consent_update"},
                        ],
                    }
                ],
            },
        ).execute()
        trig_id = created["triggerId"]
        print(f"Trigger creado: {trig_id}")
    else:
        trig_id = None
        print(f"DRY-RUN: crearía trigger customEvent '{TRIGGER_NAME}'")

    for t in ws_api.tags().list(parent=w["path"]).execute().get("tag", []):
        if t["name"] not in TARGET_TAGS:
            continue
        firing = t.get("firingTriggerId", [])
        if not apply_:
            print(f"DRY-RUN: añadiría el trigger a '{t['name']}' (firing actual: {firing})")
        elif trig_id in firing:
            print(f"'{t['name']}' ya dispara en {TRIGGER_NAME}")
        else:
            t["firingTriggerId"] = firing + [trig_id]
            ws_api.tags().update(path=t["path"], body=t).execute()
            print(f"Tag actualizado: '{t['name']}' → firing {t['firingTriggerId']}")

    if apply_ and publish:
        v = ws_api.create_version(
            path=w["path"],
            body={
                "name": "consent-update-retrigger",
                "notes": (
                    "LinkedIn Insight y HubSpot (Custom HTML hard-gateados) también "
                    "disparan en consent_update para cargar en la misma visita en la "
                    "que el usuario acepta el banner (Consent Mode v2, PR #18)."
                ),
            },
        ).execute()
        ver = v["containerVersion"]["containerVersionId"]
        pub = (
            svc.accounts()
            .containers()
            .versions()
            .publish(path=f"{CONTAINER}/versions/{ver}")
            .execute()
        )
        print(f"Versión {pub['containerVersion']['containerVersionId']} PUBLICADA")
    elif apply_:
        print("Cambios en workspace. Revisa en GTM Preview y publica desde la UI (o --publish).")


if __name__ == "__main__":
    main()
